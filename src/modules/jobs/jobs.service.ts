import { Model } from 'mongoose';
import { Injectable, Inject, NotFoundException, forwardRef, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseQueryParser } from 'mongoose-query-parser';

import { Job } from './jobs.schema';
import { UpdateJobDto } from './dto/update-job.dto';
import { FindJobsDto } from './dto/find-jobs.dto';
import { FindOneJobDto } from './dto/find-one-job.dto';
import { SetJobMetadataDto } from './dto/set-job-metadata.dto';
import { PutJobMetadataDto } from './dto/put-job-metadata.dto';
import { CreateJobForProjectDto } from './dto/create-job-for-project.dto';
import { ProjectsService } from '../projects/projects.service';
import { JobDbChangeEvent } from './types/job.types';


@Injectable()
export class JobsService {

  private log = new Logger(JobsService.name);

  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @Inject(forwardRef(() => ProjectsService)) private projectsService: ProjectsService,
  ) {}

  async create(projectId: string, createJobDto: CreateJobForProjectDto): Promise<Job> {
    this.log.debug(`Creating job for project #${projectId}`);
    const project = await this.projectsService.findOne({ id: projectId });
    if (!project) {
      throw new Error(`Project #${projectId} not found`);
    }

    const job = new this.jobModel({ ...createJobDto, project });
    return await job.save();
  }

  async find(findJobsDto: FindJobsDto = {}): Promise<Job[]> {
    const { withProject, deleted, query, params } = findJobsDto;
    const q = this.jobModel.find({ ...(params ?? {}), deletedAt: deleted ? { $ne: null } : null });
    
    // If there is a query string provided, use it to search the name field
    const parser = new MongooseQueryParser();
    if (query) {
      const parsedQuery = parser.parse(query);
      q.find(parsedQuery.filter);
    }

    if (withProject) {
      q.populate('project');
    }
    
    return await q.exec();
  }

  async findOne(findOneJobDto: FindOneJobDto): Promise<Job> {
    const query = this.jobModel.findOne({ _id: findOneJobDto.id });
    if (findOneJobDto.withProject) {
      query.populate('project');
    }

    return await query.exec();
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.jobModel.findOne({ _id: id }).exec();
    if (!job) {
      throw new NotFoundException(`Job #${id} not found`);
    }

    job.set(updateJobDto);
    return job.save();
  }

  async setJobMetadata(id: string, setJobMetadata: SetJobMetadataDto): Promise<Job> {
    const job = await this.jobModel.findOne({ _id: id }).exec();
    if (!job) {
      throw new NotFoundException(`Job #${id} not found`);
    }

    job.metadata = setJobMetadata.metadata;
    return await job.save();
  }

  async putJobMetadata(id: string, putJobMetadata: PutJobMetadataDto): Promise<Job> {
    const job = await this.jobModel.findOne({ _id: id }).exec();
    if (!job) {
      throw new NotFoundException(`Job #${id} not found`);
    }

    // Iterate over input metadata and set it on the job
    for (const [key, value] of Object.entries(putJobMetadata.metadata)) {
      job.metadata.set(key, value);
    }

    return await job.save();
  }

  async delete(id: string): Promise<Job> {
    const job = await this.jobModel.findOne({ _id: id }).exec();
    if (!job) {
      throw new NotFoundException(`Job #${id} not found`);
    }

    job.deletedAt = new Date();
    return job.save();
  }

  async hardDelete(id: string): Promise<Job> {
    return await this.jobModel.findOneAndDelete({ _id: id }).exec();
  }

  registerDbChangeListener(changeListener: (event: JobDbChangeEvent) => void) {
    this.jobModel.watch().on('change', changeListener);
  }
}

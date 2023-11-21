import { Model } from 'mongoose';
import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseQueryParser } from 'mongoose-query-parser';

import { Project } from './projects.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FindProjectsDto } from './dto/find-projects.dto';
import { FindOneProjectDto } from './dto/find-one-project.dto';
import { SetProjectMetadataDto } from './dto/set-project-metadata.dto';
import { PutProjectMetadataDto } from './dto/put-project-metadata.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentsService } from '../documents/documents.service';
import { Job } from '../jobs/jobs.schema';
import { JobsService } from '../jobs/jobs.service';
import { JobTypes } from '../jobs/types/job.types';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @Inject(DocumentsService) private documentsService: DocumentsService,
    @Inject(forwardRef(() => JobsService)) private jobsService: JobsService
  ) {
    console.log(`ProjectsService Init`)
  }

  async create(createProjectDto: CreateProjectDto): Promise<Job> {
    let createdProject = new this.projectModel(createProjectDto);
    createdProject = await createdProject.save();

    // Once the project is created, we need to create a job for it
    const createdJob = await this.jobsService.create(createdProject.id, {
      type: JobTypes.CREATE_PROJECT,
      input: {
        projectId: createdProject.id
      }
    });

    return createdJob;
  }

  async find(findProjectsDto: FindProjectsDto = {}): Promise<Project[]> {
    const { withDocuments, withIngests, deleted, query, ...params } = findProjectsDto;
    const q = this.projectModel.find({ ...params, deletedAt: deleted ? { $ne: null } : null });
    
    // If there is a query string provided, use it to search the name field
    const parser = new MongooseQueryParser();
    if (query) {
      const parsedQuery = parser.parse(query);
      q.find(parsedQuery.filter);
    }

    if (withDocuments) {
      q.populate('documents');
    }

    if (withIngests) {
      q.populate('ingests');
    }
    
    return await q.exec();
  }

  async findOne(findOneProjectDto: FindOneProjectDto): Promise<Project> {
    const query = this.projectModel.findOne({ _id: findOneProjectDto.id });
    if (findOneProjectDto.withDocuments) {
      query.populate('documents');
    }

    if (findOneProjectDto.withIngests) {
      query.populate('ingests');
    }
    
    return await query.exec();
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id }).exec();
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    project.set(updateProjectDto);
    return project.save();
  }

  async setProjectMetadata(id: string, setProjectMetadata: SetProjectMetadataDto): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id }).exec();
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    project.metadata = setProjectMetadata.metadata;
    return await project.save();
  }

  async putProjectMetadata(id: string, putProjectMetadata: PutProjectMetadataDto): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id }).exec();
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    // Iterate over input metadata and set it on the project
    for (const [key, value] of Object.entries(putProjectMetadata.metadata)) {
      project.metadata.set(key, value);
    }

    return await project.save();
  }

  async addDocument(id: string, createDocumentDto: CreateDocumentDto) {
    return await this.documentsService.create({ projectId: id, ...createDocumentDto });
  }

  async delete(id: string): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id }).exec();
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    project.deletedAt = new Date();
    return project.save();
  }

  async hardDelete(id: string): Promise<Project> {
    return await this.projectModel.findOneAndDelete({ _id: id }).exec();
  }
}

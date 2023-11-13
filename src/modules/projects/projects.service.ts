import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './projects.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FindProjectByNameDto } from './dto/find-project-by-name.dto';
import { FindAllProjectsDto } from './dto/find-all-projects.dto';
import { FindOneProjectDto } from './dto/find-one-project.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  async findAll(findAllProjectsDto: FindAllProjectsDto = {}): Promise<Project[]> {
    const query = this.projectModel.find();
    if (findAllProjectsDto.withDocuments) {
      query.populate('documents');
    }

    if (findAllProjectsDto.withIngests) {
      query.populate('ingests');
    }
    
    return this.projectModel.find().exec();
  }

  async findOne(findOneProjectDto: FindOneProjectDto): Promise<Project[]> {
    const query = this.projectModel.findOne({ _id: findOneProjectDto.id });
    if (findOneProjectDto.withDocuments) {
      query.populate('documents');
    }

    if (findOneProjectDto.withIngests) {
      query.populate('ingests');
    }
    
    return this.projectModel.find().exec();
  }

  async findByName(findByNameDto: FindProjectByNameDto): Promise<Project | null> {
    const query = this.projectModel.findOne({ name: findByNameDto.name });
    if (findByNameDto.withDocuments) {
      query.populate('documents');
    }

    if (findByNameDto.withIngests) {
      query.populate('ingests');
    }

    return await query.exec();
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id }).exec();
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    project.overwrite(updateProjectDto);
    return project.save();
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

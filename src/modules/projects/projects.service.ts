import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './projects.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from 'src/app/projects/dto/update-project.dto';
import { FindProjectByNameDto } from 'src/app/projects/dto/find-project-by-name.dto';
import { FindAllProjectsDto } from './dto/find-all-projects.dto';

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

  async findByName(findByNameDto: FindProjectByNameDto): Promise<Project | null> {
    // With related documents
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
    const project = await this.projectModel.findOne({ id }).exec();
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    project.overwrite(updateProjectDto);
    return project.save();
  }

  async delete(id: string): Promise<void> {
    await this.projectModel.findOneAndDelete({ id }).exec();
  }
}

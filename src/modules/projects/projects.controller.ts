import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { FindProjectsDto } from './dto/find-projects.dto';
import { PutProjectMetadataDto } from './dto/put-project-metadata.dto';
import { SetProjectMetadataDto } from './dto/set-project-metadata.dto';
import { FindOneProjectDto } from './dto/find-one-project.dto';



@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async find(@Query() query: FindProjectsDto) {
    return await this.projectsService.find(query);
  }

  @Get(':id')
  async findOne(@Param() params: FindOneProjectDto) {
    return await this.projectsService.findOne(params);
  }

  @UseGuards()
  @Post()
  async create(@Body() data: CreateProjectDto) {
    return await this.projectsService.create(data);
  }

  @Put(':id')
  async update(@Param() param, @Body() body: CreateProjectDto) {
    const data = await this.projectsService.update(param.id, body);
    return {
      message: `Project ${param.id} updated`,
      data
    }
  }

  @Post(':id/metadata')
  async setMetadata(@Param() param, @Body() body: PutProjectMetadataDto) {
    const data = await this.projectsService.setProjectMetadata(param.id, body);
    return {
      message: `Metadata for project ${param.id} updated`,
      data
    }
  }

  @Put(':id/metadata')
  async putMetadata(@Param() param, @Body() body: SetProjectMetadataDto) {
    const data = await this.projectsService.putProjectMetadata(param.id, body);
    return {
      message: `Metadata for project ${param.id} updated`,
      data
    }
  }

  @Delete(':id')
  async delete(@Param() params) {
    const data = await this.projectsService.delete(params.id);
    if (!data) {
      return {
        error: `Project ${params.id} not found`
      }
    }

    return {
      message: `Project ${params.id} deleted`,
      data
    }
  }

  @Delete(':id/hard')
  async hardDelete(@Param() params) {
    await this.projectsService.hardDelete(params.id);
    return {
      message: `Project ${params.id} permanently deleted`
    }
  }
}

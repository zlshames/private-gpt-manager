import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';


@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll() {
    const result = this.projectsService.findAll();
    return result;
  }

  @Get(':id')
  findOne(@Param() params) {
    const result = this.projectsService.findOne(params.id);
    return result;
  }

  @UseGuards()
  @Post()
  async create(@Body() data: CreateProjectDto) {
    const result = await this.projectsService.create(data);
    return result;
  }

  @Put(':id')
  async update(@Param() param) {
    const data = await this.projectsService.update(param.id, param);
    return {
      message: `Project ${param.id} updated`,
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

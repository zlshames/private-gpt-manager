import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll() {
    const result = this.projectsService.findAll();
    return result;
  }

  @Get(':id')
  findOne(id: string): string {
    return 'This action returns one project';
  }

  @Post()
  create(): string {
    return 'This action creates a project';
  }

  @Put(':id')
  update(id: string): string {
    return 'This action updates a project';
  }

  @Delete(':id')
  delete(id: string): string {
    return 'This action deletes a project';
  }
}

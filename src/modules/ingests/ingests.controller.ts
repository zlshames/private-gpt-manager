import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('ingests')
export class IngestsController {
  @Get()
  findAll(): string {
    return 'This action returns all ingests';
  }

  @Get(':id')
  findOne(id: string): string {
    return 'This action returns one ingest';
  }

  @Post()
  create(): string {
    return 'This action creates a ingest';
  }

  @Put(':id')
  update(id: string): string {
    return 'This action updates a ingest';
  }

  @Delete()
  delete(id: string): string {
    return 'This action deletes a ingest';
  }
}

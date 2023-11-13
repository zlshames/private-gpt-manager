import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get()
  findAll(): string {
    return 'This action returns all documents';
  }

  @Get(':id')
  findOne(id: string): string {
    return 'This action returns one document';
  }

  @Post()
  create(): string {
    return 'This action creates a document';
  }

  @Put(':id')
  update(id: string): string {
    return 'This action updates a document';
  }

  @Delete(':id')
  delete(id: string): string {
    return 'This action deletes a document';
  }
}

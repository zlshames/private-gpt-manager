import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentForProjectDto } from './dto/create-document-for-project.dto';
import { FindDocumentsDto } from './dto/find-documents.dto';
import { PutDocumentMetadataDto } from './dto/put-document-metadata.dto';
import { SetDocumentMetadataDto } from './dto/set-document-metadata.dto';
import { FindOneDocumentDto } from './dto/find-one-document.dto';



@Controller({
  version: '1',
  path: 'documents'
})
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get()
  async find(@Query() query: FindDocumentsDto) {
    return await this.documentsService.find(query);
  }

  @Get(':id')
  async findOne(@Param() params: FindOneDocumentDto) {
    return await this.documentsService.findOne(params);
  }

  @UseGuards()
  @Post()
  async create(@Body() data: CreateDocumentForProjectDto) {
    return await this.documentsService.create(data);
  }

  @Put(':id')
  async update(@Param() param, @Body() body: CreateDocumentForProjectDto) {
    const data = await this.documentsService.update(param.id, body);
    return {
      message: `Document ${param.id} updated`,
      data
    }
  }

  @Post(':id/metadata')
  async setMetadata(@Param() param, @Body() body: PutDocumentMetadataDto) {
    const data = await this.documentsService.setDocumentMetadata(param.id, body);
    return {
      message: `Metadata for document ${param.id} updated`,
      data
    }
  }

  @Put(':id/metadata')
  async putMetadata(@Param() param, @Body() body: SetDocumentMetadataDto) {
    const data = await this.documentsService.putDocumentMetadata(param.id, body);
    return {
      message: `Metadata for document ${param.id} updated`,
      data
    }
  }

  @Delete(':id')
  async delete(@Param() params) {
    const data = await this.documentsService.delete(params.id);
    if (!data) {
      return {
        error: `Document ${params.id} not found`
      }
    }

    return {
      message: `Document ${params.id} deleted`,
      data
    }
  }

  @Delete(':id/hard')
  async hardDelete(@Param() params) {
    await this.documentsService.hardDelete(params.id);
    return {
      message: `Document ${params.id} permanently deleted`
    }
  }
}

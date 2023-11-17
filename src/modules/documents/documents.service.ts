import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseQueryParser } from 'mongoose-query-parser';

import { Document } from './documents.schema';
import { CreateDocumentForProjectDto } from './dto/create-document-for-project.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FindDocumentsDto } from './dto/find-documents.dto';
import { FindOneDocumentDto } from './dto/find-one-document.dto';
import { SetDocumentMetadataDto } from './dto/set-document-metadata.dto';
import { PutDocumentMetadataDto } from './dto/put-document-metadata.dto';

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(Document.name) private documentModel: Model<Document>) {}

  async create(createDocumentDto: CreateDocumentForProjectDto): Promise<Document> {
    const createdDocument = new this.documentModel(createDocumentDto);
    return await createdDocument.save();
  }

  async find(findDocumentsDto: FindDocumentsDto = {}): Promise<Document[]> {
    const { withProject, deleted, query, ...params } = findDocumentsDto;
    const q = this.documentModel.find({ ...params, deletedAt: deleted ? { $ne: null } : null });
    
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

  async findOne(findOneDocumentDto: FindOneDocumentDto): Promise<Document> {
    const query = this.documentModel.findOne({ _id: findOneDocumentDto.id });
    if (findOneDocumentDto.withProject) {
      query.populate('project');
    }

    return await query.exec();
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const document = await this.documentModel.findOne({ _id: id }).exec();
    if (!document) {
      throw new NotFoundException(`Document #${id} not found`);
    }

    document.set(updateDocumentDto);
    return document.save();
  }

  async setDocumentMetadata(id: string, setDocumentMetadata: SetDocumentMetadataDto): Promise<Document> {
    const document = await this.documentModel.findOne({ _id: id }).exec();
    if (!document) {
      throw new NotFoundException(`Document #${id} not found`);
    }

    document.metadata = setDocumentMetadata.metadata;
    return await document.save();
  }

  async putDocumentMetadata(id: string, putDocumentMetadata: PutDocumentMetadataDto): Promise<Document> {
    const document = await this.documentModel.findOne({ _id: id }).exec();
    if (!document) {
      throw new NotFoundException(`Document #${id} not found`);
    }

    // Iterate over input metadata and set it on the document
    for (const [key, value] of Object.entries(putDocumentMetadata.metadata)) {
      document.metadata.set(key, value);
    }

    return await document.save();
  }

  async delete(id: string): Promise<Document> {
    const document = await this.documentModel.findOne({ _id: id }).exec();
    if (!document) {
      throw new NotFoundException(`Document #${id} not found`);
    }

    document.deletedAt = new Date();
    return document.save();
  }

  async hardDelete(id: string): Promise<Document> {
    return await this.documentModel.findOneAndDelete({ _id: id }).exec();
  }
}

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document } from './documents.schema';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(Document.name) private documentModel: Model<Document>) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const createdDocument = new this.documentModel(createDocumentDto);
    return createdDocument.save();
  }

  async findAll(): Promise<Document[]> {
    return this.documentModel.find().exec();
  }

  async findOne(): Promise<Document[]> {
    return this.documentModel.find().exec();
  }

  async update(): Promise<Document[]> {
    return this.documentModel.find().exec();
  }

  async delete(): Promise<Document[]> {
    return this.documentModel.find().exec();
  }
}

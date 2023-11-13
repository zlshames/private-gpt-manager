import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ingest } from './ingests.schema';
import { CreateIngestDto } from './dto/create-ingest.dto';

@Injectable()
export class IngestsService {
  constructor(@InjectModel(Ingest.name) private ingestModel: Model<Ingest>) {}

  async create(createIngestDto: CreateIngestDto): Promise<Ingest> {
    const createdIngest = new this.ingestModel(createIngestDto);
    return createdIngest.save();
  }

  async findAll(): Promise<Ingest[]> {
    return this.ingestModel.find().exec();
  }

  async findOne(): Promise<Ingest[]> {
    return this.ingestModel.find().exec();
  }

  async update(): Promise<Ingest[]> {
    return this.ingestModel.find().exec();
  }

  async delete(): Promise<Ingest[]> {
    return this.ingestModel.find().exec();
  }
}

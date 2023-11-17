import { Model, UpdateWriteOpResult } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseQueryParser } from 'mongoose-query-parser';

import { Alert } from './alerts.schema';
import { MarkAlertsReadDto } from './dto/mark-alerts-read.dto';
import { FindAlertsDto } from './dto/find-alerts.dto';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(Alert.name) private alertModel: Model<Alert>
  ) {}

  async create(createAlertDto: CreateAlertDto): Promise<Alert> {
    const createdAlert = new this.alertModel(createAlertDto);
    return await createdAlert.save();
  }

  async find(findAlertsDto: FindAlertsDto = {}): Promise<Alert[]> {
    const { withProject, deleted, query, ...params } = findAlertsDto;
    const q = this.alertModel.find({ ...params, deletedAt: deleted ? { $ne: null } : null });
    
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

  async markRead(markAlertsReadDto: MarkAlertsReadDto): Promise<UpdateWriteOpResult> {
    return await this.alertModel.updateMany(
      { _id: { $in: markAlertsReadDto.alertIds } }, { readAt: new Date() });
  }
}

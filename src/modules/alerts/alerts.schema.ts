import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AlertType } from './types/alert.types';
import { Project } from '../projects/projects.schema';

export type AlertDocument = HydratedDocument<Alert>;

@Schema({
  timestamps: true,
  versionKey: false
})
export class Alert {
  _id: string;
  
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    default: AlertType.INFO
  })
  type: AlertType;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    nullable: false
  })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    nullable: false,
  })
  content: string;

  @Prop({
    type: mongoose.Schema.Types.Map,
    required: false,
    default: {},
    nullable: false
  })
  metadata: Record<string, any>;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  })
  project: Project;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null,
    nullable: true
  })
  readAt: Date;

  createdAt: Date;

  updatedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null,
    nullable: true
  })
  deletedAt: Date;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
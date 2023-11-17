import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../projects/projects.schema';

export type DocumentDocument = HydratedDocument<Document>;

@Schema({
  timestamps: true,
  versionKey: false
})
export class Document {
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true
  })
  path: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true
  })
  hash: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  })
  project: Project;

  @Prop({
    type: mongoose.Schema.Types.Map,
    required: false,
    default: {},
  })
  metadata: Record<string, any>;

  createdAt: Date;

  updatedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null
  })
  deletedAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
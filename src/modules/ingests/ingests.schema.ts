import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../projects/projects.schema';

export type IngestIngest = HydratedDocument<Ingest>;

@Schema({
  timestamps: true,
  versionKey: false
})
export class Ingest {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    auto: true
  })
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true
  })
  result: string;

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

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: true,
    default: new Date(),
    nullable: false,
    auto: true
  })
  createdAt: Date;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: true,
    default: new Date(),
    nullable: false,
    auto: true
  })
  updatedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null
  })
  deletedAt: Date;
}

export const IngestSchema = SchemaFactory.createForClass(Ingest);
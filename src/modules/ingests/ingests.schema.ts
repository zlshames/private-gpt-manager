import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../projects/projects.schema';

export type IngestIngest = HydratedDocument<Ingest>;

@Schema()
export class Ingest {
  @Prop({
    type: mongoose.Schema.Types.String
  })
  id: string;

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
    raw: raw({
      // Nothing for now
    }),
    required: false,
    default: {},
  })
  metadata: Record<string, any>;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: true,
    default: () => new Date()
  })
  createdAt: Date;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: true,
    default: () => new Date()
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
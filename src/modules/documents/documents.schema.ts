import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../projects/projects.schema';

export type DocumentDocument = HydratedDocument<Document>;

@Schema({
  timestamps: true,
  versionKey: false
})
export class Document {
  @Prop({
    type: mongoose.Schema.Types.String
  })
  id: string;

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
    required: true
  })
  hash: string;

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
    required: false,
    default: null
  })
  deletedAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
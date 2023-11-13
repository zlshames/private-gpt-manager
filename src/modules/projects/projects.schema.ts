import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({
  timestamps: true,
  versionKey: false
})
export class Project {
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
    required: false,
    default: '',
    nullable: false
  })
  description: string;

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Document' }
    ]
  })
  documents: Document[];

  @Prop({
    type: mongoose.Schema.Types.Map,
    raw: raw({
      // Nothing for now
    }),
    required: false,
    default: {},
    nullable: false
  })
  metadata: Record<string, any>;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null,
    nullable: true
  })
  deletedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
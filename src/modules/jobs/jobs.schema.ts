import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../projects/projects.schema';
import { JobOutput, JobStatus, JobTypes } from './types/job.types';

export type JobJob = HydratedDocument<Job>;

@Schema({
  timestamps: true,
  versionKey: false
})
export class Job {
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true
  })
  type: JobTypes;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    default: JobStatus.PENDING
  })
  status: JobStatus;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0
  })
  progress: number;

  @Prop({
    type: mongoose.Schema.Types.Map,
    required: false,
    default: {}
  })
  input: Record<string, any>;

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
    // map with errors?, message?, and data?
    type: mongoose.Schema.Types.Map,
    raw: raw({
      errors: {
        type: mongoose.Schema.Types.Array,
        required: false,
        raw: raw({
          message: {
            type: mongoose.Schema.Types.String,
            required: true
          },
          data: {
            type: mongoose.Schema.Types.Map,
            required: false,
            default: {}
          }
        })
      },
      message: { type: String, required: true },
      data: {
        type: mongoose.Schema.Types.Map,
        required: false,
        default: {}
      }
    }),
    required: false,
    default: {
      errors: [],
      message: 'No Response Yet',
      data: {}
    }
  })
  output: JobOutput;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null
  })
  completedAt: Date;

  createdAt: Date;

  updatedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null
  })
  deletedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
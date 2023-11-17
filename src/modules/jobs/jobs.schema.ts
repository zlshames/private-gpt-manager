import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Project } from '../projects/projects.schema';
import { JobOutput, JobStatus, JobTypes } from './types/job.types';

export type JobJob = HydratedDocument<Job>;

@Schema({
  timestamps: true,
  versionKey: false
})
export class Job {
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
    of: new mongoose.Schema({
      errors: {
        type: mongoose.Schema.Types.Array,
        required: false,
        of: new mongoose.Schema({
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
      message: {
        type: mongoose.Schema.Types.String,
        required: true
      },
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

export const JobSchema = SchemaFactory.createForClass(Job);
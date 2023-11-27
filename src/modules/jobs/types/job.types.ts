import { Job } from "../jobs.schema";

export type JobErrors = [
  {
    message: string;
    stack?: string;
    data?: Map<string, any>;
  }
];

export type JobOutput = {
  errors?: JobErrors;
  message: string;
  data?: Map<string, any>;
};

export enum JobTypes {
  CREATE_PROJECT = 'project.create',
  START_PROJECT = 'project.start',
  ENABLE_PROJECT = 'project.enable',
  DISABLE_PROJECT = 'project.disable',
  STOP_PROJECT = 'project.stop',
  DELETE_PROJECT = 'project.delete',
  INGEST_DOCUMENT = 'project.document.ingest'
};

export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  COMPLETED_WITH_ERRORS = 'completed-with-errors',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export type JobDbChangeEvent = {
  job?: Job;
  operationType: 'insert' | 'update' | 'delete';
}
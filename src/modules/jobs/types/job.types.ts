export type JobErrors = [
  {
    message: string;
    data?: Map<string, any>;
  }
];

export type JobOutput = {
  errors: JobErrors;
  message: string;
  data?: Map<string, any>;
};

export enum JobTypes {
  CREATE_PROJECT = 'project.create',
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
import { Inject, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsService } from './jobs.service';
import { Job, JobSchema } from './jobs.schema';
import { ProjectsModule } from '../projects/projects.module';
import { JobExecutor } from './lib/job-executor';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Job.name, schema: JobSchema }
    ]),
    ProjectsModule
  ],
  controllers: [],
  providers: [
    JobsService
  ],
  exports: [
    JobsService
  ]
})
export class JobsModule {

  jobExecutor: JobExecutor;

  constructor(@Inject(JobsService) private jobsService: JobsService) {
    this.jobExecutor = new JobExecutor(this.jobsService);
    this.jobExecutor.start();
  }
}
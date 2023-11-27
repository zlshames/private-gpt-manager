import { Inject, Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { JobExecutorsService } from './job-executors.service';
import { JobsModule } from '../jobs/jobs.module';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [
    AlertsModule,
    ProjectsModule,
    JobsModule
  ],
  controllers: [],
  providers: [
    JobExecutorsService
  ],
  exports: [
    JobExecutorsService
  ]
})
export class JobExecutorsModule {
  constructor(
    @Inject(JobExecutorsService) private jobExecutorsService: JobExecutorsService
  ) {
    this.jobExecutorsService.start();
  }
}
import { Inject, Module, forwardRef } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { JobExecutorsService } from './job-executors.service';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [
    forwardRef(() => ProjectsModule),
    forwardRef(() => JobsModule)
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
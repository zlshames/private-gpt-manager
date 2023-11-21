import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsService } from './jobs.service';
import { Job, JobSchema } from './jobs.schema';
import { ProjectsModule } from '../projects/projects.module';
import { JobExecutorsModule } from '../job-executors/job-executors.module';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Job.name, schema: JobSchema }
    ]),
    forwardRef(() => ProjectsModule),
    forwardRef(() => JobExecutorsModule)
  ],
  controllers: [],
  providers: [
    JobsService
  ],
  exports: [
    JobsService
  ]
})
export class JobsModule {}
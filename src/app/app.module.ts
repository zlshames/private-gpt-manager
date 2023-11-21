import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IngestsModule } from '../modules/ingests/ingests.module';
import { DocumentsModule } from '../modules/documents/documents.module';
import { DbModule } from '../modules/db/db.module';
import { FileSystemModule } from '../modules/filesystem/filesystem.module';
import { JobExecutorsModule } from 'src/modules/job-executors/job-executors.module';


@Module({
  imports: [
    FileSystemModule,
    DbModule,
    IngestsModule,
    DocumentsModule,
    // ProjectsModule & JobsModule are circular dependencies
    // So we import them through JobExecutorsModule, using forwardRef
    JobExecutorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}

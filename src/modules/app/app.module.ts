import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from '../projects/projects.module';
import { IngestsModule } from '../ingests/ingests.module';
import { DocumentsModule } from '../documents/documents.module';
import { DbModule } from '../db/db.module';
import { FileSystemModule } from '../filesystem/filesystem.module';
import { JobsModule } from '../jobs/jobs.module';


@Module({
  imports: [
    FileSystemModule,
    DbModule,
    ProjectsModule,
    IngestsModule,
    DocumentsModule,
    JobsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}

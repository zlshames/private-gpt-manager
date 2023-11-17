import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from '../projects/projects.module';
import { IngestsModule } from '../ingests/ingests.module';
import { DocumentsModule } from '../documents/documents.module';
import { DbModule } from '../db/db.module';
import { FileSystemModule } from '../filesystem/filesystem.module';


@Module({
  imports: [
    FileSystemModule,
    DbModule,
    ProjectsModule,
    IngestsModule,
    DocumentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}

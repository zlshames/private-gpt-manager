import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema } from './projects.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Project.name, schema: ProjectSchema }
    ])
  ],
  controllers: [
    ProjectsController
  ],
  providers: [
    ProjectsService
  ],
})

export class ProjectsModule {}
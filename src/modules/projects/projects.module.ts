import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema } from './projects.schema';
import { RequireJsonMiddleware } from 'src/middleware/require-json.middleware';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Project.name, schema: ProjectSchema },
    ]),
    DocumentsModule
  ],
  controllers: [
    ProjectsController
  ],
  providers: [
    ProjectsService,
  ],
  exports: [
    ProjectsService
  ]
})
export class ProjectsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequireJsonMiddleware)
      .forRoutes(
        { path: 'projects', method: RequestMethod.POST },
        { path: 'projects/:id', method: RequestMethod.PUT }
      );

  }
}
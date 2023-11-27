import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { Alert, AlertSchema } from './alerts.schema';
import { RequireJsonMiddleware } from 'src/middleware/require-json.middleware';
import { DocumentsModule } from '../documents/documents.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Alert.name, schema: AlertSchema },
    ]),
    DocumentsModule,
    ProjectsModule,
  ],
  controllers: [
    AlertsController
  ],
  providers: [
    AlertsService,
  ],
  exports: [
    AlertsService
  ]
})
export class AlertsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequireJsonMiddleware)
      .forRoutes(
        { path: 'alerts', method: RequestMethod.POST },
        { path: 'alerts/:id', method: RequestMethod.PUT }
      );

  }
}
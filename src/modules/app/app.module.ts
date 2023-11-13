import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from '../projects/projects.module';
import { IngestsModule } from '../ingests/ingests.module';
import { DocumentsModule } from '../documents/documents.module';

require('dotenv').config();

const dbHost = process.env.MONGODB_HOST || 'localhost';
const dbPort = process.env.MONGODB_PORT || '27017';
const dbUser = process.env.MONGODB_USERNAME || '';
const dbPassword = process.env.MONGODB_PASSWORD || '';
const dbName = process.env.MONGODB_DATABASE || 'private-gpt-manager';

@Module({
  imports: [
    // Initialize the connection to the database
    MongooseModule.forRoot(
      `mongodb://${dbHost}:${dbPort}`,
      {
        user: dbUser,
        pass: dbPassword,
        dbName: dbName
      }
    ),
    // Import the modules for each resource
    ProjectsModule,
    IngestsModule,
    DocumentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

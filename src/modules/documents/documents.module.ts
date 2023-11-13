import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document, DocumentSchema } from './documents.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Document.name, schema: DocumentSchema }
    ])
  ],
  controllers: [
    DocumentsController
  ],
  providers: [
    DocumentsService
  ],
})

export class DocumentsModule {}
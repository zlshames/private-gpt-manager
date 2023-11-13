import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngestsController } from './ingests.controller';
import { IngestsService } from './ingests.service';
import { Ingest, IngestSchema } from './ingests.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Ingest.name, schema: IngestSchema }
    ])
  ],
  controllers: [
    IngestsController
  ],
  providers: [
    IngestsService
  ],
})

export class IngestsModule {}
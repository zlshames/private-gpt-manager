import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import fmp from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });
  
  app.register(fmp, {
    limits: {
      files: 1
    }
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000, '0.0.0.0');
}

bootstrap();

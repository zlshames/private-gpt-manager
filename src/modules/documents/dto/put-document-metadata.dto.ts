import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class PutDocumentMetadataDto {
  @IsObject()
  @ApiProperty({ required: true })
  metadata: Record<string, any>;
}
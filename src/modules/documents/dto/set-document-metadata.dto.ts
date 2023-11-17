import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class SetDocumentMetadataDto {
  @IsObject()
  @ApiProperty({ required: true })
  metadata: Record<string, any>;
}
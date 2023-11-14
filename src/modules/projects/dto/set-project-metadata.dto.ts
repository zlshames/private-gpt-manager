import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class SetProjectMetadataDto {
  @IsObject()
  @ApiProperty({ required: true })
  metadata: Record<string, any>;
}
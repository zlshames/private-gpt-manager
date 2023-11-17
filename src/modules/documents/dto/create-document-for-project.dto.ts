import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';

export class CreateDocumentForProjectDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  projectId: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ required: false })
  metadata?: Record<string, any>;
}
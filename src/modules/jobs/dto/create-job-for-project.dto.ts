import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsString } from 'class-validator';
import { JobTypes } from '../types/job.types';

export class CreateJobForProjectDto {
  @IsEnum(JobTypes)
  @ApiProperty({ required: true })
  type: JobTypes;

  @IsObject()
  @ApiProperty({ required: true, default: {} })
  input: Record<string, any> = {};
}
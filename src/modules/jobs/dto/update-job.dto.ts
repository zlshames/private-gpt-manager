import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { JobStatus, JobTypes } from '../types/job.types';

export class UpdateJobDto {
  @IsOptional()
  @IsEnum(JobTypes)
  @ApiProperty({ required: false })
  type?: JobTypes;

  @IsOptional()
  @IsEnum(JobStatus)
  @ApiProperty({ required: false })
  status?: JobStatus;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  progress?: number;

  @IsOptional()
  @IsObject()
  @ApiProperty({ required: false })
  metadata?: Record<string, any>;

  @IsOptional()
  @IsObject()
  @ApiProperty({ required: false })
  output?: Record<string, any>;
}
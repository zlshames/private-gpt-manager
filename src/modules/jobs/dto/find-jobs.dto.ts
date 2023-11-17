import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBooleanString, IsString, IsObject } from 'class-validator';


export class FindJobsDto {
  @IsOptional()
  @IsBooleanString()
  @ApiProperty({ required: false, default: 'false' })
  withProject?: string = 'false';

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  query?: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ required: false })
  params?: Record<string, any> = {};

  @IsOptional()
  @IsBooleanString()
  @ApiProperty({ required: false, default: 'false' })
  deleted?: string = 'false';
}
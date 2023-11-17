import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class FindOneJobDto {
  @IsString()
  @ApiProperty({ required: true })
  id: string;

  @IsOptional()
  @IsBooleanString()
  @ApiProperty({ required: false, default: 'false' })
  withProject?: string = 'false';
}
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBooleanString, IsString } from 'class-validator';

export class FindJobsDto {
  @IsOptional()
  @IsBooleanString()
  @ApiProperty({ required: false, default: 'false' })
  withProject?: string = 'false';

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  query?: string;

  @IsOptional()
  @IsBooleanString()
  @ApiProperty({ required: false, default: 'false' })
  deleted?: string = 'false';
}
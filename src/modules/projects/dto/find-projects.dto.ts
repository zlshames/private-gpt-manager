import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBooleanString, IsString } from 'class-validator';

export class FindProjectsDto {
  @IsOptional()
  @IsBooleanString()
  @ApiProperty({ required: false, default: 'false' })
  withDocuments?: string = 'false';

  @IsOptional()
  @IsBooleanString()
  @ApiProperty({ required: false, default: 'false' })
  withIngests?: string = 'false';

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
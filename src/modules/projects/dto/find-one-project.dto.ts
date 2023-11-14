import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class FindOneProjectDto {
  @IsString()
  @ApiProperty({ required: true })
  id: string;

  @IsOptional()
  @IsBooleanString()
  @ApiProperty({ required: false, default: 'false' })
  withDocuments?: string = 'false';

  @IsOptional()
  @IsBooleanString()
  @ApiProperty({ required: false, default: 'false' })
  withIngests?: string = 'false';
}
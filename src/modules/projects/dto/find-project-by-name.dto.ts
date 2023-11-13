import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class FindProjectByNameDto {
  @IsString()
  @ApiProperty({ required: true })
  name: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  withDocuments?: boolean = false;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  withIngests?: boolean = false;
}
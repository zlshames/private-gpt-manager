import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class FindAllProjectsDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  withDocuments?: boolean = false;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  withIngests?: boolean = false;
}
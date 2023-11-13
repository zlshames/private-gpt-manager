import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FindOneProjectDto {
  @IsString()
  @ApiProperty({ required: true })
  id: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  withDocuments?: boolean = false;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  withIngests?: boolean = false;
}
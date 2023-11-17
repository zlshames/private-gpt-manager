import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { AlertType } from '../types/alert.types';


export class CreateAlertDto {
  @IsNotEmpty()
  @IsEnum(AlertType)
  @ApiProperty({ required: true })
  type: AlertType;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  content: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ required: false })
  metadata?: Record<string, any>;
}
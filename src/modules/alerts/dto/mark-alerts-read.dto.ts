import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';

export class MarkAlertsReadDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ required: true })
  alertIds: string[];
}
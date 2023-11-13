import { ApiProperty } from '@nestjs/swagger';

export class CreateIngestDto {
  @ApiProperty({ required: true })
  id: string;
}
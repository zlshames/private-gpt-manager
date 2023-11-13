import { ApiProperty } from '@nestjs/swagger';

export class FindProjectByNameDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: false, default: false })
  withDocuments?: boolean = false;

  @ApiProperty({ required: false, default: false })
  withIngests?: boolean = false;
}
import { ApiProperty } from '@nestjs/swagger';

export class FindAllProjectsDto {
  @ApiProperty({ required: false, default: false })
  withDocuments?: boolean = false;

  @ApiProperty({ required: false, default: false })
  withIngests?: boolean = false;
}
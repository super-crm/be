import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRepositoryDto {
  @ApiProperty()
  @IsString()
  path: string;
}

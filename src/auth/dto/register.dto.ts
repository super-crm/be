import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

import { IsUserAlreadyExists } from '../validators/is-user-already-exists';

export class RegisterDto implements Partial<User> {
  @IsEmail()
  @IsUserAlreadyExists()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;
}

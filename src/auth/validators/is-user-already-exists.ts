import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

import { UsersService } from '../../users/users.service';

@ValidatorConstraint({ name: 'IsUserAlreadyExists', async: true })
@Injectable()
export class IsUserAlreadyExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersService: UsersService) {}

  async validate(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);

    return !user;
  }

  defaultMessage(): string {
    return 'User with this email already exists.';
  }
}

export function IsUserAlreadyExists(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistsConstraint,
    });
  };
}

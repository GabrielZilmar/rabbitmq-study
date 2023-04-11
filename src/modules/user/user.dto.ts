import { Injectable } from '@nestjs/common';
import { ReqresUser, User } from 'src/modules/user/types';

@Injectable()
export default class UserDto {
  public toDto({
    data: { id, email, first_name, last_name, avatar },
  }: ReqresUser): User {
    return {
      id,
      email,
      firstName: first_name,
      lastName: last_name,
      avatarUrl: avatar,
    };
  }
}

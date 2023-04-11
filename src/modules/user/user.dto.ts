import { Injectable } from '@nestjs/common';
import { IReqresUser, IUser } from '~modules/user/types';

@Injectable()
export default class UserDto {
  public toDto({
    data: { id, email, first_name, last_name, avatar },
  }: IReqresUser): IUser {
    return {
      id,
      email,
      firstName: first_name,
      lastName: last_name,
      avatarUrl: avatar,
    };
  }
}

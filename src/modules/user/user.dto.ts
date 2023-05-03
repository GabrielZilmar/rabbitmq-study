import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IReqresUser, IUser } from '~/modules/user/types';

@Injectable()
export default class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  avatarUrl: string;

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

import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IPersistenceUser, IReqresUser, IUser } from '~/modules/user/types';

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

  public regresToDto({
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

  public persistenceToDto({
    email,
    firstName,
    lastName,
    avatarUrl,
    _id,
  }: IPersistenceUser): IUser {
    return {
      id: _id.toString(),
      email,
      firstName: firstName,
      lastName: lastName,
      avatarUrl,
    };
  }
}

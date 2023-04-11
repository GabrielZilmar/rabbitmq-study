import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import UserDto from '~modules/user/user.dto';
import { ReqresUser, User } from '~modules/user/types';

@Injectable()
export class UserServices {
  public reqresUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly userDto: UserDto,
  ) {
    this.reqresUrl = process.env.REQRES_URL;
  }

  async getUser(userId: number): Promise<User> {
    const { data: reqresUser } = await firstValueFrom(
      this.httpService
        .get<ReqresUser>(`${this.reqresUrl}/users/${userId}`)
        .pipe(
          catchError((error: AxiosError) => {
            throw `An error happened! Could not get user. Error: ${error.message}`;
          }),
        ),
    );

    return this.userDto.toDto(reqresUser);
  }
}

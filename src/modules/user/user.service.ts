import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import UserDto from '~modules/user/user.dto';
import { IReqresUser, IUser, IUserCreate } from '~modules/user/types';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '~modules/user/schemas/user.schema';
import { Model } from 'mongoose';
import { HttpStatus } from '~utils/http-status';
import { ClientProxy } from '@nestjs/microservices';
import { Avatar } from '~modules/user/schemas/avatar.schema';

@Injectable()
export class UserServices {
  public reqresUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly userDto: UserDto,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Avatar.name) private avatarModel: Model<Avatar>,
    @Inject('RMQ_SERVICE') private client: ClientProxy,
  ) {
    this.reqresUrl = process.env.REQRES_URL;
  }

  private async preventDuplicatedUser(email?: string): Promise<void> {
    if (!email) {
      throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
    }

    const userExist = await this.userModel.findOne({ email }).exec();
    if (userExist) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }
  }

  private async avatarExists(userId: number): Promise<Buffer | null> {
    const avatar = await this.avatarModel.findOne({ userId }).exec();

    return avatar?.content || null;
  }

  async createUser(user: IUserCreate): Promise<IUser> {
    try {
      await this.preventDuplicatedUser(user.email);

      const newUser = new this.userModel(user);
      const userCreated = await newUser.save();
      this.client.emit({ cmd: 'user-created' }, userCreated);

      return userCreated;
    } catch (err: unknown) {
      const statusCode =
        typeof err === typeof HttpException
          ? (err as HttpException).getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException((err as Error).message, statusCode);
    }
  }

  async getUser(userId: number): Promise<IUser> {
    const { data: reqresUser } = await firstValueFrom(
      this.httpService
        .get<IReqresUser>(`${this.reqresUrl}/users/${userId}`)
        .pipe(
          catchError((error: AxiosError) => {
            throw `An error happened! Could not get user. Error: ${error.message}`;
          }),
        ),
    );

    return this.userDto.toDto(reqresUser);
  }

  async getUserAvatar(userId: number): Promise<Buffer> {
    try {
      const user = await this.getUser(userId);
      const { avatarUrl } = user;

      const avatarExists = await this.avatarExists(userId);
      if (avatarExists) {
        return avatarExists;
      }

      const response = this.httpService.get(avatarUrl, {
        responseType: 'arraybuffer',
      });
      const { data } = await firstValueFrom(response);
      const dataBuffer = Buffer.from(data, 'base64');

      const newAvatar = new this.avatarModel({
        userId,
        content: dataBuffer,
      });
      await newAvatar.save();

      return dataBuffer;
    } catch (err: unknown) {
      const statusCode =
        typeof err === typeof HttpException
          ? (err as HttpException).getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException((err as Error).message, statusCode);
    }
  }

  async deleteUserAvatar(userId: number): Promise<boolean> {
    try {
      const avatarExists = await this.avatarExists(userId);
      if (!avatarExists) {
        throw new HttpException('User avatar not found', HttpStatus.NOT_FOUND);
      }

      await this.avatarModel.deleteOne({ userId });
      return true;
    } catch (err: unknown) {
      const statusCode =
        typeof err === typeof HttpException
          ? (err as HttpException).getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException((err as Error).message, statusCode);
    }
  }
}

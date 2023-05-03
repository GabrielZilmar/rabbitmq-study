import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { IUser } from '~/modules/user/types';
import { UserServices } from '~/modules/user/user.service';
import { Response } from 'express';
import UserDto from '~/modules/user/user.dto';

@Controller('/api')
export class UserController {
  constructor(private readonly appService: UserServices) {}

  @Post('/users')
  async createUser(@Body() user: UserDto): Promise<IUser> {
    return this.appService.createUser(user);
  }

  @EventPattern({ cmd: 'user-created' })
  async handleUserCreatedEvent(data: IUser) {
    await this.appService.sendEmail(data.email);
  }

  @Get('/user/:id')
  async getUser(
    @Param('id', new ParseIntPipe()) userId: number,
  ): Promise<IUser> {
    return this.appService.getUser(userId);
  }

  @Get('/user/:id/avatar')
  async getUserAvatar(
    @Param('id', new ParseIntPipe()) userId: number,
    @Res() res: Response,
  ) {
    const imgBuffer = await this.appService.getUserAvatar(userId);
    const contentType = 'image/jpeg';

    res.set({
      'Content-Type': contentType,
      'Content-Length': imgBuffer.length,
    });
    res.send(imgBuffer);
  }

  @Delete('/user/:id/avatar')
  async deleteUserAvatar(@Param('id', new ParseIntPipe()) userId: number) {
    return this.appService.deleteUserAvatar(userId);
  }
}

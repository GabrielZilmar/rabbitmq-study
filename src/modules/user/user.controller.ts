import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { IUser, IUserCreate } from '~modules/user/types';
import { UserServices } from '~modules/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly appService: UserServices) {}

  @Post('/create')
  async createUser(@Body() user: IUserCreate): Promise<IUser> {
    return this.appService.createUser(user);
  }

  @EventPattern({ cmd: 'user-created' })
  async handleUserCreatedEvent(data: Record<string, unknown>) {
    console.info(data);
  }

  @Get('/:id')
  async getUser(
    @Param('id', new ParseIntPipe()) userId: number,
  ): Promise<IUser> {
    return this.appService.getUser(userId);
  }
}

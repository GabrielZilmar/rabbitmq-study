import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { IUser, IUserCreate } from '~modules/user/types';
import { UserServices } from '~modules/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly appService: UserServices) {}

  @Post('/create')
  async createUser(@Body() user: IUserCreate): Promise<IUser> {
    return this.appService.createUser(user);
  }

  @Get('/:id')
  async getUser(
    @Param('id', new ParseIntPipe()) userId: number,
  ): Promise<IUser> {
    return this.appService.getUser(userId);
  }
}

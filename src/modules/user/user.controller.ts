import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { User } from '~modules/user/types';
import { UserServices } from '~modules/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly appService: UserServices) {}

  @Get('/:id')
  async getUser(
    @Param('id', new ParseIntPipe()) userId: number,
  ): Promise<User> {
    return this.appService.getUser(userId);
  }
}

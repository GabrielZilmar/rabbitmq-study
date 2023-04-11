import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UserController } from '~modules/user/user.controller';
import { UserServices } from '~modules/user/user.service';
import UserDto from '~modules/user/user.dto';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [UserServices, UserDto],
})
export class UserModule {}

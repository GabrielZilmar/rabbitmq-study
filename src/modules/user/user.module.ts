import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UserController } from '~modules/user/user.controller';
import { UserServices } from '~modules/user/user.service';
import UserDto from '~modules/user/user.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '~modules/user/schemas/user.schema';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserServices, UserDto],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UserController } from '~/modules/user/user.controller';
import { UserServices } from '~/modules/user/user.service';
import UserDto from '~/modules/user/user.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '~/modules/user/schemas/user.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Avatar, AvatarSchema } from '~/modules/user/schemas/avatar.schema';
import EmailSender from '~/services/email-sender';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URL],
          queue: 'users_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Avatar.name, schema: AvatarSchema },
    ]),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
          user: process.env.EMAIL_SENDER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserServices, UserDto, EmailSender],
})
export class UserModule {}

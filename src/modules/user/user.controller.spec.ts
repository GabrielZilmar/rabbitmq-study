import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { join } from 'path';
import { UserMock } from '~/modules/user/mocks/user';
import { Avatar, AvatarSchema } from '~/modules/user/schemas/avatar.schema';
import { User, UserSchema } from '~/modules/user/schemas/user.schema';
import { UserController } from '~/modules/user/user.controller';
import UserDto from '~/modules/user/user.dto';
import { UserServices } from '~/modules/user/user.service';
import EmailSender from '~/services/email-sender';

describe('UserController', () => {
  beforeEach(async () => {
    const userModule: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
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
        MongooseModule.forRoot(process.env.DATABASE_URL),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Avatar.name, schema: AvatarSchema },
        ]),
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'public'),
          serveRoot: '/src/images',
        }),
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
    }).compile();

    userController = userModule.get<UserController>(UserController);
  });

  let userController: UserController;
  let userModel: Model<User>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserServices],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userModel = moduleRef.get<Model<User>>(getModelToken('UserModel'));
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  describe('root', () => {
    it('should create a user', async () => {
      const user = await userController.createUser(UserMock.toCreate);

      expect(user).toMatchObject({
        email: UserMock.toCreate.email,
        firstName: UserMock.toCreate.firstName,
        lastName: UserMock.toCreate.lastName,
        avatarUrl: UserMock.toCreate.avatarUrl,
        _id: expect.any(String),
        __v: expect.any(Number),
      });
    });
  });
});

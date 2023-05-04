import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserMock } from '~/modules/user/mocks/user';
import { Avatar, AvatarSchema } from '~/modules/user/schemas/avatar.schema';
import { User, UserSchema } from '~/modules/user/schemas/user.schema';
import { UserController } from '~/modules/user/user.controller';
import UserDto from '~/modules/user/user.dto';
import { UserServices } from '~/modules/user/user.service';
import EmailSender from '~/services/email-sender';

describe('UserController', () => {
  let userModel: Model<User>;
  let userController: UserController;
  let userServices: UserServices;
  let rabbitMQService: ClientProxy;
  let emailSender: EmailSender;

  beforeAll(async () => {
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

    userModel = userModule.get<Model<User>>(getModelToken('User'));
    userController = userModule.get<UserController>(UserController);
    userServices = userModule.get<UserServices>(UserServices);
    rabbitMQService = userModule.get<ClientProxy>('RMQ_SERVICE');
    emailSender = userModule.get<EmailSender>(EmailSender);
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  describe('root', () => {
    it('should create a user', async () => {
      const handleUserPreventDuplicatedMock = jest.fn();
      jest
        .spyOn(userServices, 'preventDuplicatedUser')
        .mockImplementation(handleUserPreventDuplicatedMock);

      const handleClientEmitEventMock = jest.fn();
      jest
        .spyOn(rabbitMQService, 'emit')
        .mockImplementation(handleClientEmitEventMock);

      const user = await userController.createUser(UserMock.toCreate);

      const expected = {
        ...UserMock.toCreate,
        id: expect.any(String),
      };

      expect(user).toMatchObject(expected);
      expect(handleUserPreventDuplicatedMock).toHaveBeenCalledWith(user.email);
      expect(handleClientEmitEventMock).toHaveBeenCalledWith(
        { cmd: 'user-created' },
        user,
      );
    });

    it('should not create a duplicated user', async () => {
      try {
        await userController.createUser(UserMock.toCreate);
        const duplicatedUser = UserMock.toCreate;
        await userController.createUser(duplicatedUser);
      } catch (error) {
        expect((error as Error).message).toContain('dup key');
      }
    });
  });
});

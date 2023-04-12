import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Create user -> Check event when created user and check on db -> Check if email has been sent
  // Create duplicated user

  // Get user -> Create then get (use Dto)

  // Get image from avatar
  // Check if is getting existent user
  // Check if plain image is saved on db and on /tmp

  // Delete user and see on db and see if plain image is deleted
});

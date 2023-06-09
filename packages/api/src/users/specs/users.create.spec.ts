import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UsersModule } from '../users.module';
import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import * as request from 'supertest';
import * as admin from 'firebase-admin';
import { UserCreateDto } from '../dto/user-create.dto';

describe('Users controller CREATE', () => {
  let app: INestApplication;
  let userId: string;
  let token: string;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        FirebaseModule.forRoot('./googleApplicationCredentials.json'),
        UsersModule,
      ],
    }).compile();
    app = moduleRef.createNestApplication();

    initializeApp({
      apiKey: 'AIzaSyBFAd770G1rpq4d5su5dqgWyaeOyC1NnMo',
      authDomain: 'trickspot-20ae3.firebaseapp.com',
      projectId: 'trickspot-20ae3',
      storageBucket: 'trickspot-20ae3.appspot.com',
      messagingSenderId: '1042573471065',
      appId: '1:1042573471065:web:041e016bcfa73593aeb048',
      measurementId: 'G-GES4385QPR',
    });
    connectAuthEmulator(getAuth(), 'http://127.0.0.1:9099', {
      disableWarnings: true,
    });
    await admin.app().auth().createUser({
      email: 'testUser@test.com',
      password: '11111111',
      emailVerified: true,
    });
    const credential = await signInWithEmailAndPassword(
      getAuth(),
      'testUser@test.com',
      '11111111',
    );

    userId = credential.user.uid;
    token = await credential.user.getIdToken();
    await app.init();
  });

  it('/users POST, should return 401', async () => {
    return request(app.getHttpServer()).post('/users').expect(401);
  });

  it('/users POST, should return 400', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
  });

  it('/users POST, should return 400', async () => {
    request(app.getHttpServer())
      .post('/users')
      .send({
        nickname: 1,
        description: 'test description',
        links: [],
      })
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
    request(app.getHttpServer())
      .post('/users')
      .send({
        nickname: 'test',
        description: 1,
        links: [],
      })
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
    return request(app.getHttpServer())
      .post('/users')
      .send({
        nickname: 'test',
        description: 'test',
        links: [1],
      })
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
  });

  it('/users POST, should return 200 and 400 for the second request', async () => {
    const userDto: UserCreateDto = {
      nickname: 'testUser',
      description: 'test description',
      links: [],
    };
    const test = await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .set({ authorization: `Bearer ${token}` })
      .expect(201);
    expect(test.body.id === userId).toBeTruthy();
    expect(test.body.nickname === 'testUser').toBeTruthy();
    expect(test.body.description === 'test description').toBeTruthy();
    expect(Array.isArray(test.body.links)).toBeTruthy();
    expect(Number.isInteger(test.body.lastConnection)).toBeTruthy();
    expect(Number.isInteger(test.body.lastUpdate)).toBeTruthy();
    expect(test.body.banished === false).toBeTruthy();
    expect(test.body.createdAt).toBeDefined();
    expect(test.body.email).toBeUndefined();
    return request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
  });
  afterAll(async () => {
    if (userId) {
      await admin.app().auth().deleteUser(userId);
    }
    await app.close();
  });
});

import { Test } from '@nestjs/testing';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UsersModule } from '../users.module';
import {
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import * as admin from 'firebase-admin';
import { INestApplication } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import * as request from 'supertest';
import { UserCreateDto } from '../dto/user-create.dto';

describe('/users/:id GET', () => {
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
    connectAuthEmulator(getAuth(), 'http://127.0.0.1:9099');
    await admin.app().auth().createUser({
      email: 'testUserGet@test.com',
      password: '11111111',
      emailVerified: true,
    });
    const credential = await signInWithEmailAndPassword(
      getAuth(),
      'testUserGet@test.com',
      '11111111',
    );
    userId = credential.user.uid;
    token = await credential.user.getIdToken();
    const userDto: UserCreateDto = {
      nickname: 'GET',
      description: 'GET',
      links: [],
    };
    await app.init();
    await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .set({ authorization: `Bearer ${token}` });
  });

  it('should return 200', async () => {
    const test = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set({ authorization: `Bearer ${token}` })
      .expect(200);
    expect(test.body.id === userId).toBeTruthy();
    expect(test.body.nickname === 'GET').toBeTruthy();
    expect(test.body.description === 'GET').toBeTruthy();
    expect(Array.isArray(test.body.links)).toBeTruthy();
    expect(Number.isInteger(test.body.lastConnection)).toBeTruthy();
    expect(Number.isInteger(test.body.lastUpdate)).toBeTruthy();
    expect(test.body.banished === false).toBeTruthy();
    expect(test.body.email).toBeUndefined();
  });
  afterAll(async () => {
    if (userId) {
      await admin.auth().deleteUser(userId);
    }
  });

  it('should return 404', async () => {
    return request(app.getHttpServer())
      .get(`/users/notExist`)
      .set({ authorization: `Bearer ${token}` })
      .expect(404);
  });
});

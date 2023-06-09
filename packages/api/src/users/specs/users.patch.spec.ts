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
import { getUnixTime } from 'date-fns';

describe('Users controller PATCH ', () => {
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
      email: 'testUserPatch@test.com',
      password: '11111111',
      emailVerified: true,
    });
    const credential = await signInWithEmailAndPassword(
      getAuth(),
      'testUserPatch@test.com',
      '11111111',
    );

    userId = credential.user.uid;
    token = await credential.user.getIdToken();
    const userDto: UserCreateDto = {
      nickname: 'testUserNoneUpdate',
      description: 'test description Non Update',
      links: [],
    };
    await app.init();
    await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .set({ authorization: `Bearer ${token}` });
  });

  it('should return 401', async () => {
    return request(app.getHttpServer()).patch(`/users/${userId}`).expect(401);
  });

  it('should return 403 because not the owner resources', async () => {
    return request(app.getHttpServer())
      .patch(`/users/test`)
      .set({ authorization: `Bearer ${token}` })
      .expect(403);
  });

  it('should return 400 because the body is not valid', async () => {
    return request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
  });
  it('should return 400 field invalid', async () => {
    const now = getUnixTime(Date.now()) + 1; // set + 1 seconds in case test launch at the same times
    return request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set({ authorization: `Bearer ${token}` })
      .send({
        InvalidField: now,
      })
      .expect(400);
  });

  it('should return 200 with the last connection updated', async () => {
    const now = getUnixTime(Date.now()) + 1; // set + 1 seconds in case test launch at the same times
    const test = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set({ authorization: `Bearer ${token}` })
      .send({
        lastConnection: now,
        lastUpdate: now,
      })
      .expect(200);
    expect(test.body.lastConnection === now).toBeTruthy();
    expect(test.body.lastUpdate === now).toBeTruthy();
    expect(test.body.id === userId).toBeTruthy();
    expect(test.body.nickname).toBeDefined();
    expect(test.body.description).toBeDefined();
    expect(Array.isArray(test.body.links)).toBeTruthy();
    expect(Number.isInteger(test.body.lastConnection)).toBeTruthy();
    expect(Number.isInteger(test.body.lastUpdate)).toBeTruthy();
    expect(test.body.banished === false).toBeTruthy();
    expect(test.body.email).toBeUndefined();
    expect(test.body.createdAt).toBeDefined();
  });

  it('should return 200 with the last connection updated', async () => {
    const now = getUnixTime(Date.now()) + 1; // set + 1 seconds in case test launch at the same times
    const test = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set({ authorization: `Bearer ${token}` })
      .send({
        lastConnection: now,
      })
      .expect(200);
    expect(test.body.lastConnection === now).toBeTruthy();
    expect(test.body.lastUpdate).toBeDefined();
    expect(test.body.id === userId).toBeTruthy();
    expect(test.body.nickname).toBeDefined();
    expect(test.body.description).toBeDefined();
    expect(Array.isArray(test.body.links)).toBeTruthy();
    expect(Number.isInteger(test.body.lastConnection)).toBeTruthy();
    expect(Number.isInteger(test.body.lastUpdate)).toBeTruthy();
    expect(test.body.banished === false).toBeTruthy();
    expect(test.body.email).toBeUndefined();
    expect(test.body.createdAt).toBeDefined();
  });

  it('should return 200 with the last connection updated', async () => {
    const now = getUnixTime(Date.now()) + 1; // set + 1 seconds in case test launch at the same times
    const test = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set({ authorization: `Bearer ${token}` })
      .send({
        lastUpdate: now,
      })
      .expect(200);
    expect(test.body.lastConnection).toBeDefined();
    expect(test.body.lastUpdate === now).toBeTruthy();
    expect(test.body.id === userId).toBeTruthy();
    expect(test.body.nickname).toBeDefined();
    expect(test.body.description).toBeDefined();
    expect(Array.isArray(test.body.links)).toBeTruthy();
    expect(Number.isInteger(test.body.lastConnection)).toBeTruthy();
    expect(Number.isInteger(test.body.lastUpdate)).toBeTruthy();
    expect(test.body.banished === false).toBeTruthy();
    expect(test.body.email).toBeUndefined();
    expect(test.body.createdAt).toBeDefined();
  });

  afterAll(async () => {
    if (userId) {
      await admin.app().auth().deleteUser(userId);
    }
    await app.close();
  });
});

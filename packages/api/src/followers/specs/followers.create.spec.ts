import { Test } from '@nestjs/testing';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { INestApplication } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { UserCreateDto } from 'src/users/dto/user-create.dto';
import { UsersModule } from 'src/users/users.module';
import * as request from 'supertest';
import { initializeApp } from 'firebase/app';
import { FollowersModule } from '../followers.module';

describe('CREATE POST LIKE', () => {
  let app: INestApplication;
  let userId: string;
  let secondUserId: string;
  let token: string;
  let token2: string;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        FirebaseModule.forRoot('./googleApplicationCredentials.json', {
          storageBucket: 'gs://trickspot-20ae3.appspot.com',
        }),
        UsersModule,
        FollowersModule,
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
    await app.init();
    await admin.app().auth().createUser({
      email: 'testUserFollower@test.com',
      password: '11111111',
      emailVerified: true,
    });
    const credential = await signInWithEmailAndPassword(
      getAuth(),
      'testUserFollower@test.com',
      '11111111',
    );

    userId = credential.user.uid;
    token = await credential.user.getIdToken();
    await app.init();
    const userDto: UserCreateDto = {
      nickname: 'testUserFollower',
      description: 'testUserFollower',
      links: [],
    };
    await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .set({ authorization: `Bearer ${token}` })
      .expect(201);

    await admin.app().auth().createUser({
      email: 'testUserFollower2@test.com',
      password: '11111111',
      emailVerified: true,
    });
    const credential2 = await signInWithEmailAndPassword(
      getAuth(),
      'testUserFollower2@test.com',
      '11111111',
    );

    secondUserId = credential2.user.uid;
    token2 = await credential2.user.getIdToken();
    await app.init();
    const userDto2: UserCreateDto = {
      nickname: 'testUserFollower2',
      description: 'testUserFollower2',
      links: [],
    };
    await request(app.getHttpServer())
      .post('/users')
      .send(userDto2)
      .set({ authorization: `Bearer ${token2}` })
      .expect(201);
  });

  it('should return 401', async () => {
    await request(app.getHttpServer())
      .post(`/users/${userId}/followers`)
      .expect(401);
  });

  it('should return 404 post not found', async () => {
    await request(app.getHttpServer())
      .post(`/users/wrongUser/followers`)
      .set({ authorization: `Bearer ${token2}` })
      .expect(404);
  });
  it('should return 201 with the good body', async () => {
    const test = await request(app.getHttpServer())
      .post(`/users/${userId}/followers`)
      .set({ authorization: `Bearer ${token2}` })
      .expect(201);

    expect(test.body.id === `${userId}_${secondUserId}`).toBeTruthy();
    expect(test.body.followerId === secondUserId).toBeTruthy();
    expect(test.body.followedId === userId).toBeTruthy();
    expect(test.body.followerUsername === 'testUserFollower2').toBeTruthy();
    expect(test.body.createdAt.seconds).toBeDefined();
    expect(test.body.createdAt.nanoseconds).toBeDefined();
    const user1 = await admin.firestore().doc(`users/${userId}`).get();
    console.log(user1.data());
    expect(user1.data().totalFollower === 1).toBeTruthy();

    const test2 = await request(app.getHttpServer())
      .post(`/users/${secondUserId}/followers`)
      .set({ authorization: `Bearer ${token}` })
      .expect(201);

    expect(test2.body.id === `${secondUserId}_${userId}`).toBeTruthy();
    expect(test2.body.followerId === userId).toBeTruthy();
    expect(test2.body.followedId === secondUserId).toBeTruthy();
    expect(test2.body.followerUsername === 'testUserFollower').toBeTruthy();
    expect(test2.body.createdAt.seconds).toBeDefined();
    expect(test2.body.createdAt.nanoseconds).toBeDefined();
  });
  it('should return 400 already exist', async () => {
    await request(app.getHttpServer())
      .post(`/users/${userId}/followers`)
      .set({ authorization: `Bearer ${token2}` })
      .expect(400);

    await request(app.getHttpServer())
      .post(`/users/${secondUserId}/followers`)
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
  });
  it('should return 400 a user cant follow himself', async () => {
    return await request(app.getHttpServer())
      .post(`/users/${userId}/followers`)
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
  });
  afterAll(async () => {
    if (userId) {
      admin.auth().deleteUser(userId);
    }
    if (secondUserId) {
      admin.auth().deleteUser(secondUserId);
    }
  });
});

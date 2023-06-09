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
import * as admin from 'firebase-admin';
import { UserCreateDto } from '../dto/user-create.dto';
import * as request from 'supertest';

describe('/users/:id/image PUT', () => {
  let app: INestApplication;
  let userId: string;
  let token: string;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        FirebaseModule.forRoot('./googleApplicationCredentials.json', {
          storageBucket: 'gs://trickspot-20ae3.appspot.com',
        }),
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
      email: 'testUserUpdateImg@test.com',
      password: '11111111',
      emailVerified: true,
    });
    const credential = await signInWithEmailAndPassword(
      getAuth(),
      'testUserUpdateImg@test.com',
      '11111111',
    );

    userId = credential.user.uid;
    token = await credential.user.getIdToken();
    const userDto: UserCreateDto = {
      nickname: 'testUserUpdateImg',
      description: 'testUserUpdateImg',
      links: [],
    };
    await app.init();
    await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .set({ authorization: `Bearer ${token}` });
  });

  it('should return 400', async () => {
    await request(app.getHttpServer())
      .put(`/users/${userId}/image`)
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
  });
  it('should return 400 wrong format', async () => {
    await request(app.getHttpServer())
      .put(`/users/${userId}/image`)
      .attach('image', `${__dirname}/assets/wrongFormat.png`)
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
  });
  it('should return 400 to big', async () => {
    await request(app.getHttpServer())
      .put(`/users/${userId}/image`)
      .attach('image', `${__dirname}/assets/toBig.jpeg`)
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
  });
  it('should return 200', async () => {
    const test = await request(app.getHttpServer())
      .put(`/users/${userId}/image`)
      .attach('image', `${__dirname}/assets/good.jpeg`)
      .set({ authorization: `Bearer ${token}` })
      .expect(200);
    expect(test.body.url !== undefined).toBeTruthy();
  });
  afterAll(async () => {
    if (userId) {
      admin.auth().deleteUser(userId);
    }
  });
});

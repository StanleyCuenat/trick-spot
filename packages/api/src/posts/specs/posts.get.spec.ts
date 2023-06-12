import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import * as request from 'supertest';
import * as admin from 'firebase-admin';
import { PostsModule } from '../posts.module';
import { PostCreateDto } from '../dto/post-create.dto';
import { readFile } from 'fs/promises';
import { UserCreateDto } from 'src/users/dto/user-create.dto';
import { UsersModule } from 'src/users/users.module';

describe('POSTS controller GET', () => {
  let app: INestApplication;
  let userId: string;
  let token: string;
  let postId: string;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        FirebaseModule.forRoot('./googleApplicationCredentials.json', {
          storageBucket: 'gs://trickspot-20ae3.appspot.com',
        }),
        PostsModule,
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
      email: 'testPostGet@test.com',
      password: '11111111',
      emailVerified: true,
    });
    const credential = await signInWithEmailAndPassword(
      getAuth(),
      'testPostGet@test.com',
      '11111111',
    );

    userId = credential.user.uid;
    token = await credential.user.getIdToken();
    await app.init();
    const userDto: UserCreateDto = {
      nickname: 'testUser',
      description: 'test description',
      links: [],
    };
    await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .set({ authorization: `Bearer ${token}` })
      .expect(201);
    const file = admin.storage().bucket().file(`users/${userId}/videos/test2`);
    const img = await readFile(`${__dirname}/assets/good.jpeg`);
    await file.save(img, { contentType: 'images/jpeg' });
    const postDto: PostCreateDto = {
      videoId: 'test2',
      description: 'test',
      geoPoint: {
        longitude: 0,
        latitude: 0,
      },
      tags: ['yolo'],
    };
    const result = await request(app.getHttpServer())
      .post('/posts')
      .set({ authorization: `Bearer ${token}` })
      .send(postDto)
      .expect(201);
    postId = result.body.id;
  });

  it('/post/:id GET, should return 401', async () => {
    return request(app.getHttpServer()).get(`/posts/${postId}`).expect(401);
  });

  it('/post/:id GET, should return 404', async () => {
    return request(app.getHttpServer())
      .get(`/posts/wrongPath`)
      .set({ authorization: `Bearer ${token}` })
      .expect(404);
  });

  it('/posts/:id GET, should return 200 with the good body', async () => {
    const test = await request(app.getHttpServer())
      .get(`/posts/${postId}`)
      .set({ authorization: `Bearer ${token}` })
      .expect(200);
    expect(test.body.id).toBeDefined();
    expect(test.body.userId === userId).toBeTruthy();
    expect(test.body.username).toBeDefined();
    expect(test.body.videoId === 'test2').toBeTruthy();
    expect(test.body.description).toBeDefined();
    expect(test.body.geoHash).toBeDefined();
    expect(test.body.geoPoint.latitude === 0).toBeTruthy();
    expect(test.body.geoPoint.longitude === 0).toBeTruthy();
    expect(test.body.tags.length === 1).toBeTruthy();
    expect(test.body.totalViews === 1).toBeTruthy();
    expect(test.body.totalComments === 0).toBeTruthy();
    expect(test.body.totalLikes === 0).toBeTruthy();
    expect(Number.isInteger(test.body.createdAt.seconds)).toBeTruthy();
    expect(Number.isInteger(test.body.lastUpdate.seconds)).toBeTruthy();
    const test2 = await request(app.getHttpServer())
      .get(`/posts/${postId}`)
      .set({ authorization: `Bearer ${token}` })
      .expect(200);
    expect(test2.body.totalViews === 2).toBeTruthy();
  });

  afterAll(async () => {
    if (userId) {
      await admin.app().auth().deleteUser(userId);
    }
    await app.close();
  });
});

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
import { PostUpdateDto } from '../dto/post-update.dto';
import { getUnixTime } from 'date-fns';

describe('POSTS controller UPDATE', () => {
  let app: INestApplication;
  let userId: string;
  let wrongUserToken: string;
  let wrongUserId: string;
  let token: string;
  let postId: string;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        FirebaseModule.forRoot('./googleApplicationCredentials.json', {
          storageBucket: 'gs://trickspot-20ae3.appspot.com',
        }),
        PostsModule,
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
      email: 'testPostUpdate@test.com',
      password: '11111111',
      emailVerified: true,
    });
    const credential = await signInWithEmailAndPassword(
      getAuth(),
      'testPostUpdate@test.com',
      '11111111',
    );

    await admin.app().auth().createUser({
      email: 'testPostUpdateWrong@test.com',
      password: '11111111',
      emailVerified: true,
    });
    const wrongCredential = await signInWithEmailAndPassword(
      getAuth(),
      'testPostUpdateWrong@test.com',
      '11111111',
    );

    userId = credential.user.uid;
    token = await credential.user.getIdToken();
    wrongUserId = wrongCredential.user.uid;
    wrongUserToken = await wrongCredential.user.getIdToken();
    await app.init();
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
      type: 'test',
    };
    const result = await request(app.getHttpServer())
      .post('/posts')
      .set({ authorization: `Bearer ${token}` })
      .send(postDto)
      .expect(201);
    postId = result.body.id;
  });

  it('/post/:id PUT, should return 401', async () => {
    return request(app.getHttpServer()).put(`/posts/${postId}`).expect(401);
  });

  it('/posts/:id PUT, should return 401 not the good user', async () => {
    const dto: PostUpdateDto = {
      description: 'dont care',
      geoPoint: {
        longitude: 0,
        latitude: 0,
      },
      tags: [],
      type: 'string',
    };
    return request(app.getHttpServer())
      .put(`/posts/${postId}`)
      .set({ authorization: `Bearer ${wrongUserToken}` })
      .send(dto)
      .expect(403);
  });

  it('/posts/:id PUT, should return 400', async () => {
    return request(app.getHttpServer())
      .put(`/posts/${postId}`)
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
  });

  it('/posts/:id PUT, should return 400', async () => {
    const dto: PostUpdateDto = {
      description: 'dont care',
      geoPoint: {
        longitude: 0,
        latitude: 0,
      },
      tags: [],
      type: 'string',
    };
    return request(app.getHttpServer())
      .put(`/posts/${postId}`)
      .set({ authorization: `Bearer ${token}` })
      .send({
        ...dto,
        wrongField: 'lol',
      })
      .expect(400);
  });

  it('/posts/:id PUT, should return 200', async () => {
    const dto: PostUpdateDto = {
      description: 'dont care',
      geoPoint: {
        longitude: 0,
        latitude: 0,
      },
      tags: [],
      type: 'string',
    };
    return request(app.getHttpServer())
      .put(`/posts/${postId}`)
      .set({ authorization: `Bearer ${token}` })
      .send(dto)
      .expect(200);
  });

  it('/posts/:id PUT, should return 200 with the good body', async () => {
    const now = getUnixTime(Date.now());
    const dto: PostUpdateDto = {
      description: 'dont care',
      geoPoint: {
        longitude: 0,
        latitude: 0,
      },
      tags: [],
      type: 'string',
    };
    await new Promise((r) => setTimeout(r, 1000));
    const test = await request(app.getHttpServer())
      .put(`/posts/${postId}`)
      .set({ authorization: `Bearer ${token}` })
      .send(dto)
      .expect(200);
    expect(test.body.id).toBeDefined();
    expect(test.body.userId === userId).toBeTruthy();
    expect(test.body.videoId === 'test2').toBeTruthy();
    expect(test.body.description).toBeDefined();
    expect(test.body.geoHash).toBeDefined();
    expect(test.body.geoPoint.latitude === 0).toBeTruthy();
    expect(test.body.geoPoint.longitude === 0).toBeTruthy();
    expect(test.body.tags.length === 0).toBeTruthy();
    expect(test.body.type === 'string').toBeTruthy();
    expect(test.body.totalViews === 0).toBeTruthy();
    expect(Number.isInteger(test.body.createdAt.seconds)).toBeTruthy();
    expect(Number.isInteger(test.body.lastUpdate.seconds)).toBeTruthy();
    expect(
      test.body.lastUpdate.seconds > test.body.createdAt.seconds,
    ).toBeTruthy();
    expect(test.body.lastUpdate.seconds >= now).toBeTruthy();
  });

  afterAll(async () => {
    if (userId) {
      await admin.app().auth().deleteUser(userId);
    }
    if (wrongUserId) {
      await admin.app().auth().deleteUser(wrongUserId);
    }
    await app.close();
  });
});

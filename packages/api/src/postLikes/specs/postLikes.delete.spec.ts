import { Test } from '@nestjs/testing';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { INestApplication } from '@nestjs/common';
import { PostsModule } from 'src/posts/posts.module';
import { PostLikesModule } from '../postLikes.module';
import * as admin from 'firebase-admin';
import {
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { UserCreateDto } from 'src/users/dto/user-create.dto';
import { UsersModule } from 'src/users/users.module';
import * as request from 'supertest';
import { readFile } from 'fs/promises';
import { PostCreateDto } from 'src/posts/dto/post-create.dto';
import { initializeApp } from 'firebase/app';

describe('DELETE POST LIKE', () => {
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
        UsersModule,
        PostsModule,
        PostLikesModule,
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
      email: 'testPostLikeDelete@test.com',
      password: '11111111',
      emailVerified: true,
    });
    const credential = await signInWithEmailAndPassword(
      getAuth(),
      'testPostLikedelete@test.com',
      '11111111',
    );

    userId = credential.user.uid;
    token = await credential.user.getIdToken();
    await app.init();
    const userDto: UserCreateDto = {
      nickname: 'testUserLikePostDelete',
      description: 'test description like post',
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
      tags: ['yolo56'],
    };
    const post = await request(app.getHttpServer())
      .post('/posts')
      .set({ authorization: `Bearer ${token}` })
      .send(postDto)
      .expect(201);
    postId = post.body.id;
    await request(app.getHttpServer())
      .post(`/posts/${postId}/likes`)
      .set({ authorization: `Bearer ${token}` })
      .expect(201);
  });
  it('should return 401', async () => {
    return request(app.getHttpServer())
      .delete(`/posts/${postId}/likes`)
      .expect(401);
  });

  it('should return 404 post not found', async () => {
    return request(app.getHttpServer())
      .delete(`/posts/notFound/likes`)
      .set({ authorization: `Bearer ${token}` })
      .expect(404);
  });
  it('should return 201 with the good body', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${postId}/likes`)
      .set({ authorization: `Bearer ${token}` })
      .expect(200);
    const snap = await admin
      .firestore()
      .doc(`postLikes/${postId}_${userId}`)
      .get();
    expect(snap.exists === false).toBeTruthy();
    const post = await admin.firestore().doc(`posts/${postId}`).get();
    expect(post.data().totalLikes === 0).toBeTruthy();
  });
  afterAll(async () => {
    if (userId) {
      admin.auth().deleteUser(userId);
    }
  });
});

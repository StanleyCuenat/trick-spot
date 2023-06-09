import { Response } from 'express';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import {
  Controller,
  Get,
  HttpStatus,
  INestApplication,
  MiddlewareConsumer,
  Module,
  Res,
} from '@nestjs/common';
import { AuthMiddleware } from '../auth.middleware';
import { FirebaseModule } from 'src/firebase/firebase.module';
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import {
  signInWithEmailAndPassword,
  getAuth,
  connectAuthEmulator,
} from 'firebase/auth';
@Controller()
class TestController {
  @Get('authenticated')
  authenticatedRoute(@Res() res: Response) {
    return res.status(HttpStatus.OK).send();
  }
}

@Module({
  controllers: [TestController],
})
class TestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}

describe('Authentication middleware', () => {
  let app: INestApplication;
  let userId: string;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        FirebaseModule.forRoot('./googleApplicationCredentials.json'),
        TestModule,
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
  });

  it('Should return return 401', async () => {
    return request(app.getHttpServer())
      .get('/authenticated')
      .set({ authorization: 'Bearer false' })
      .expect(401);
  });

  it('Bad authorization Bearer token, should return 401', async () => {
    return request(app.getHttpServer()).get('/authenticated').expect(401);
  });

  it('should return 200', async () => {
    await admin.app().auth().createUser({
      email: 'test@test.com',
      password: '11111111',
      emailVerified: true,
    });
    const credential = await signInWithEmailAndPassword(
      getAuth(),
      'test@test.com',
      '11111111',
    );

    userId = credential.user.uid;
    const token = await credential.user.getIdToken();
    return request(app.getHttpServer())
      .get('/authenticated')
      .set({ authorization: `Bearer ${token}` })
      .expect(200);
  });

  afterAll(async () => {
    if (userId) {
      await admin.app().auth().deleteUser(userId);
    }
    await app.close();
  });
});

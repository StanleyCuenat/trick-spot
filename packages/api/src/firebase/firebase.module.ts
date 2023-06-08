import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { FirebaseAdmin } from './firebase.interface';
import * as admin from 'firebase-admin';
import { FirebaseConstants } from './firebase.constant';

function createFirebaseInstance(
  googleApplicationCredentialPath: string,
  options?: admin.AppOptions,
): FirebaseAdmin {
  const app = admin.initializeApp({
    credential: admin.credential.cert(googleApplicationCredentialPath),
    ...options,
  });
  return {
    firestore: app.firestore(),
    storage: app.storage(),
    auth: app.auth(),
  };
}

@Global()
@Module({
  imports: [],
  providers: [],
})
export class FirebaseModule {
  static forRoot(
    googleApplicationCredentialPath: string,
    options?: admin.AppOptions,
  ): DynamicModule {
    const provider: Provider = {
      provide: FirebaseConstants.FIREBASE_TOKEN,
      useValue: createFirebaseInstance(
        googleApplicationCredentialPath,
        options,
      ),
    };
    return {
      module: FirebaseModule,
      providers: [provider],
      exports: [provider],
    };
  }
}

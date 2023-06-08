import { Inject } from '@nestjs/common';
import { FirebaseConstants } from './firebase.constant';

export function InjectFirebaseAdmin() {
  return Inject(FirebaseConstants.FIREBASE_TOKEN);
}

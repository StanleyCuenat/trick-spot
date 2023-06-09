import { Timestamp } from 'firebase-admin/firestore';

export interface FirebaseUserEntity {
  id: string;
  nickname: string;
  description: string;
  banished: boolean;
  lastConnection: Timestamp;
  lastUpdate: Timestamp;
  createdAt: Timestamp;
  links: string[];
  email: string;
}

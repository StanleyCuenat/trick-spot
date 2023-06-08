import { Exclude, Transform } from 'class-transformer';
import { Timestamp } from 'firebase-admin/firestore';

export class UserEntity {
  id: string;

  nickname: string;

  description: string;

  banished: boolean;

  @Transform(({ value }) => value.seconds)
  lastConnection: Timestamp;

  @Transform(({ value }) => value.seconds)
  lastUpdate: Timestamp;

  links: string[];

  @Exclude()
  email: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;

  nickname: string;

  description: string;

  banished: boolean;

  lastConnection: {
    seconds: number;
    nanoseconds: number;
  };

  lastUpdate: {
    seconds: number;
    nanoseconds: number;
  };

  links: string[];

  @Exclude()
  email: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

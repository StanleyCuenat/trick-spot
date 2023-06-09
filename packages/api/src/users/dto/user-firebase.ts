import * as assert from 'assert';
import { Timestamp } from 'firebase-admin/firestore';

interface FirebaseUserEntity {
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

export class FirebaseUserEntityDto {
  private readonly id: string;
  private readonly nickname: string;
  private readonly description: string;
  private readonly banished: boolean;
  private readonly lastConnection: Timestamp;
  private readonly lastUpdate: Timestamp;
  private readonly createdAt: Timestamp;
  private readonly links: string[];
  private readonly email: string;
  constructor(data: Record<string, unknown>) {
    assert(typeof data.id === 'string', 'id is not a string');
    assert(typeof data.nickname === 'string', 'nickname is not a string');
    assert(typeof data.description === 'string', 'description is not a string');
    assert(typeof data.id === 'string', 'id is not a string');
    assert(typeof data.banished === 'boolean', 'banished is not a boolean');
    assert(
      typeof (data.lastConnection as any).seconds === 'number',
      'lastConnection.seconds is not a number',
    );
    assert(
      typeof (data.lastConnection as any).nanoseconds === 'number',
      'lastConnection.nanoseconds is not a number',
    );
    assert(
      typeof (data.lastUpdate as any).seconds === 'number',
      'lastUpdate.seconds is not a number',
    );
    assert(
      typeof (data.lastUpdate as any).seconds === 'number',
      'lastUpdate.nanoseconds is not a number',
    );
    assert(
      typeof (data.createdAt as any).seconds === 'number',
      'createdAt.seconds is not a number',
    );
    assert(
      typeof (data.createdAt as any).seconds === 'number',
      'createdAt.nanoseconds is not a number',
    );
    assert(Array.isArray(data.links), 'links is not an array');
    assert(typeof data.email === 'string', 'email is not an array');

    this.id = data.id as string;
    this.nickname = data.nickname as string;
    this.description = data.description as string;
    this.banished = data.banished as boolean;
    this.lastConnection = new Timestamp(
      (data.lastConnection as any).seconds as number,
      (data.lastConnection as any).nanoseconds as number,
    );
    this.lastUpdate = new Timestamp(
      (data.lastUpdate as any).seconds as number,
      (data.lastUpdate as any).nanoseconds as number,
    );
    this.createdAt = new Timestamp(
      (data.createdAt as any).seconds as number,
      (data.createdAt as any).nanoseconds as number,
    );
    this.links = data.links as string[];
    this.email = data.email as string;
  }

  public toJson(): FirebaseUserEntity {
    return {
      id: this.id,
      nickname: this.nickname,
      description: this.description,
      banished: this.banished,
      lastConnection: this.lastConnection,
      lastUpdate: this.lastUpdate,
      createdAt: this.createdAt,
      links: this.links,
      email: this.email,
    };
  }
}

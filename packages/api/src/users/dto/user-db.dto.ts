import * as assert from 'assert';

interface UserDbEntity {
  id: string;
  nickname: string;
  description: string;
  totalFollower: number;
  banished: boolean;
  lastConnection: {
    seconds: number;
    nanoseconds: number;
  };
  lastUpdate: {
    seconds: number;
    nanoseconds: number;
  };
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  links: string[];
  email: string;
}

export class UserDbDto {
  private readonly id: string;
  private readonly nickname: string;
  private readonly description: string;
  private readonly totalFollower: number;
  private readonly banished: boolean;
  private readonly lastConnection: {
    seconds: number;
    nanoseconds: number;
  };
  private readonly lastUpdate: {
    seconds: number;
    nanoseconds: number;
  };
  private readonly createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  private readonly links: string[];
  private readonly email: string;
  constructor(data: Record<string, unknown>) {
    assert(typeof data.id === 'string', 'id is not a string');
    assert(typeof data.nickname === 'string', 'nickname is not a string');
    assert(typeof data.description === 'string', 'description is not a string');
    assert(
      typeof data.totalFollower === 'number',
      'totalFollower is not a number',
    );
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

    this.id = data.id;
    this.nickname = data.nickname;
    this.description = data.description;
    this.totalFollower = data.totalFollower;
    this.banished = data.banished;
    this.lastConnection = {
      seconds: (data.lastConnection as any).seconds,
      nanoseconds: (data.lastConnection as any).nanoseconds,
    };
    this.lastUpdate = {
      seconds: (data.lastUpdate as any).seconds,
      nanoseconds: (data.lastUpdate as any).nanoseconds,
    };
    this.createdAt = {
      seconds: (data.createdAt as any).seconds,
      nanoseconds: (data.createdAt as any).nanoseconds,
    };
    this.links = data.links;
    this.email = data.email;
  }

  public toJson(): UserDbEntity {
    return {
      id: this.id,
      nickname: this.nickname,
      description: this.description,
      totalFollower: this.totalFollower,
      banished: this.banished,
      lastConnection: this.lastConnection,
      lastUpdate: this.lastUpdate,
      createdAt: this.createdAt,
      links: this.links,
      email: this.email,
    };
  }
}

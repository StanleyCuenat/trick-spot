import * as assert from 'assert';

export interface FollowerDbEntity {
  id: string;
  followerId: string;
  followerUsername: string;
  followedId: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export class FollowerDbDto {
  private id: string;
  private followerId: string;
  private followerUsername: string;
  private followedId: string;
  private createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  constructor(data: Record<string, unknown>) {
    assert(typeof data.id === 'string', 'id for postLike is not a string');
    assert(typeof data.followerId === 'string', 'postId is not a string');
    assert(typeof data.followerUsername === 'string', 'userId is not a string');
    assert(typeof data.followedId === 'string', 'username is not a string');
    assert(
      typeof (data.createdAt as any).seconds === 'number',
      'createdAt.seconds is not a number',
    );
    assert(
      typeof (data.createdAt as any).nanoseconds === 'number',
      'createdAt.nanoseconds is not a number',
    );
    this.id = data.id;
    this.followerId = data.followerId;
    this.followerUsername = data.followerUsername;
    this.followerUsername = data.followerUsername;
    this.followedId = data.followedId;
    this.createdAt = {
      seconds: (data.createdAt as any).seconds,
      nanoseconds: (data.createdAt as any).nanoseconds,
    };
  }

  toJson(): FollowerDbEntity {
    return {
      id: this.id,
      followerId: this.followerId,
      followerUsername: this.followerUsername,
      followedId: this.followedId,
      createdAt: this.createdAt,
    };
  }
}

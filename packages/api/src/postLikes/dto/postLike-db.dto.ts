import * as assert from 'assert';

export interface PostLikeDbEntity {
  id: string;
  postId: string;
  userId: string;
  username: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export class PostLikeDbDto {
  private id: string;
  private postId: string;
  private userId: string;
  private username: string;
  private createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  constructor(data: Record<string, unknown>) {
    assert(typeof data.id === 'string', 'id for postLike is not a string');
    assert(typeof data.postId === 'string', 'postId is not a string');
    assert(typeof data.userId === 'string', 'userId is not a string');
    assert(typeof data.username === 'string', 'username is not a string');
    assert(
      typeof (data.createdAt as any).seconds === 'number',
      'createdAt.seconds is not a number',
    );
    assert(
      typeof (data.createdAt as any).nanoseconds === 'number',
      'createdAt.nanoseconds is not a number',
    );
    this.id = data.id;
    this.postId = data.postId;
    this.userId = data.userId;
    this.username = data.username;
    this.createdAt = {
      seconds: (data.createdAt as any).seconds,
      nanoseconds: (data.createdAt as any).nanoseconds,
    };
  }

  toJson(): PostLikeDbEntity {
    return {
      id: this.id,
      postId: this.postId,
      userId: this.userId,
      username: this.username,
      createdAt: this.createdAt,
    };
  }
}

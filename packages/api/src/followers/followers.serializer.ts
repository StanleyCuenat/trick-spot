export class FollowerEntity {
  id: string;
  followerId: string;
  followerUsername: string;
  followedId: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };

  constructor(partial: Partial<FollowerEntity>) {
    Object.assign(this, partial);
  }
}

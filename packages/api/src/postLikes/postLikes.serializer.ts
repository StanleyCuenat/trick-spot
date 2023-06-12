export class PostLikeEntity {
  id: string;
  postId: string;
  userId: string;
  username: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };

  constructor(partial: Partial<PostLikeEntity>) {
    Object.assign(this, partial);
  }
}

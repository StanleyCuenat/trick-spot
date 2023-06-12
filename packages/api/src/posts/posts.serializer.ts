export class PostEntity {
  id: string;

  userId: string;

  videoId: string;

  description: string;

  geoHash: string;

  geoPoint: {
    latitude: number;
    longitude: number;
  };

  tags: string[];

  totalViews: number;

  totalComments: number;

  totalLikes: number;

  createdAt: {
    seconds: number;
    nanoseconds: number;
  };

  lastUpdate: {
    seconds: number;
    nanoseconds: number;
  };

  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }
}

import { Transform } from 'class-transformer';

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

  type: string;

  totalViews: number;

  @Transform(({ value }) => value.seconds)
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };

  @Transform(({ value }) => value.seconds)
  lastUpdate: {
    seconds: number;
    nanoseconds: number;
  };

  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }
}

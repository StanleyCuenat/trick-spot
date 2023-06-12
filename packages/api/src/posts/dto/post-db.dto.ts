import * as assert from 'assert';

export interface PostDbEntity {
  id: string;
  userId: string;
  username: string;
  videoId: string;
  description: string;
  geoHash: string;
  geoPoint: {
    longitude: number;
    latitude: number;
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
}

export class PostDbDto {
  private id: string;
  private userId: string;
  private username: string;
  private videoId: string;
  private description: string;
  private geoHash: string;
  private geoPoint: {
    longitude: number;
    latitude: number;
  };
  private tags: string[];
  private totalViews: number;
  private totalComments: number;
  private totalLikes: number;
  private createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  private lastUpdate: {
    seconds: number;
    nanoseconds: number;
  };
  constructor(data: Record<string, unknown>) {
    assert(typeof data.id === 'string', 'post id is not a string');
    assert(typeof data.userId === 'string', 'post userId is not a string');
    assert(typeof data.username === 'string', 'post username is not a string');
    assert(typeof data.videoId === 'string', 'post videoId is not a string');
    assert(
      typeof data.description === 'string',
      'post description is not a string',
    );
    assert(typeof data.geoHash === 'string', 'post geoHash is not a string');
    assert(
      typeof (data.geoPoint as any).longitude === 'number',
      'post longitude is not a number',
    );
    assert(
      typeof (data.geoPoint as any).latitude === 'number',
      'post latitude is not a number',
    );
    assert(Array.isArray(data.tags), 'post tags is not a string array');
    assert(Array.isArray(data.tags), 'post tags is not a string array');
    assert(typeof data.totalViews === 'number', 'post totalViews is not int');
    assert(
      typeof data.totalComments === 'number',
      'post totalComments is not int',
    );
    assert(typeof data.totalLikes === 'number', 'post totalLikes is not int');
    assert(
      typeof (data.createdAt as any).seconds === 'number',
      'post createdAt seconds is not a number',
    );
    assert(
      typeof (data.createdAt as any).nanoseconds === 'number',
      'post createdAt nanoseconds is not a number',
    );
    assert(
      typeof (data.lastUpdate as any).seconds === 'number',
      'post lastUpdate seconds is not a number',
    );
    assert(
      typeof (data.lastUpdate as any).nanoseconds === 'number',
      'post lastUpdate nanoseconds is not a number',
    );
    this.id = data.id;
    this.userId = data.userId;
    this.username = data.username;
    this.videoId = data.videoId;
    this.description = data.description;
    this.geoHash = data.geoHash;
    this.geoPoint = {
      longitude: (data.geoPoint as any).longitude,
      latitude: (data.geoPoint as any).latitude,
    };
    this.tags = data.tags;
    this.totalViews = data.totalViews;
    this.totalComments = data.totalComments;
    this.totalLikes = data.totalLikes;
    this.createdAt = {
      seconds: (data.createdAt as any).seconds,
      nanoseconds: (data.createdAt as any).nanoseconds,
    };
    this.lastUpdate = {
      seconds: (data.lastUpdate as any).seconds,
      nanoseconds: (data.lastUpdate as any).nanoseconds,
    };
  }

  toJson(): PostDbEntity {
    return {
      id: this.id,
      userId: this.userId,
      username: this.username,
      videoId: this.videoId,
      description: this.description,
      geoHash: this.geoHash,
      geoPoint: this.geoPoint,
      tags: this.tags,
      totalViews: this.totalViews,
      totalComments: this.totalComments,
      totalLikes: this.totalLikes,
      createdAt: this.createdAt,
      lastUpdate: this.lastUpdate,
    };
  }
}

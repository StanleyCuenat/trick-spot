import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectFirebaseAdmin } from 'src/firebase/firebase.decorator';
import { FirebaseAdmin } from 'src/firebase/firebase.interface';
import { PostCreateDto } from './dto/post-create.dto';
import { PostDbDto } from './dto/post-db.dto';
import { GeoPoint, Timestamp } from 'firebase-admin/firestore';
import * as geofire from 'geofire-common';

@Injectable()
export class PostService {
  private readonly firebase: FirebaseAdmin;
  constructor(@InjectFirebaseAdmin() firebase: FirebaseAdmin) {
    this.firebase = firebase;
  }

  async create(postDto: PostCreateDto, userId: string) {
    const now = Timestamp.now();
    const videoFile = this.firebase.storage
      .bucket()
      .file(`users/${userId}/videos/${postDto.videoId}`);
    const fileExists = await videoFile.exists();
    if (fileExists.includes(false)) {
      throw new BadRequestException({
        videoId: postDto.videoId,
        message: 'video does not exist',
      });
    }
    const post = {
      userId: userId,
      videoId: postDto.videoId,
      description: postDto.description,
      geoHash: geofire.geohashForLocation([
        postDto.geoPoint.latitude,
        postDto.geoPoint.longitude,
      ]),
      geoPoint: new GeoPoint(
        postDto.geoPoint.latitude,
        postDto.geoPoint.longitude,
      ),
      tags: postDto.tags,
      type: postDto.type,
      totalViews: 0,
      createdAt: now,
      lastUpdate: now,
    };
    const doc = await this.firebase.firestore.collection(`posts`).add(post);
    return new PostDbDto({
      ...post,
      id: doc.id,
    });
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectFirebaseAdmin } from 'src/firebase/firebase.decorator';
import { FirebaseAdmin } from 'src/firebase/firebase.interface';
import { PostCreateDto } from './dto/post-create.dto';
import { PostDbDto } from './dto/post-db.dto';
import { GeoPoint, Timestamp, FieldValue } from 'firebase-admin/firestore';
import * as geofire from 'geofire-common';
import { PostUpdateDto } from './dto/post-update.dto';

@Injectable()
export class PostService {
  private readonly firebase: FirebaseAdmin;
  constructor(@InjectFirebaseAdmin() firebase: FirebaseAdmin) {
    this.firebase = firebase;
  }

  async getOne(id: string): Promise<PostDbDto> {
    const dataSnap = await this.firebase.firestore.doc(`posts/${id}`).get();
    if (!dataSnap.exists) {
      throw new NotFoundException(`post ${id} not found`);
    }
    return new PostDbDto({
      id: dataSnap.id,
      ...dataSnap.data(),
    });
  }

  async findOne(id: string): Promise<PostDbDto> {
    return this.firebase.firestore.runTransaction(async (t) => {
      const ref = this.firebase.firestore.doc(`posts/${id}`);
      const dataSnap = await t.get(ref);
      if (!dataSnap.exists) {
        throw new NotFoundException(`post ${id} not found`);
      }
      t.update(ref, {
        totalViews: FieldValue.increment(1),
      });
      return new PostDbDto({
        id: dataSnap.id,
        ...dataSnap.data(),
        totalViews: dataSnap.data().totalViews + 1,
      });
    });
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
      totalComments: 0,
      totalLikes: 0,
      createdAt: now,
      lastUpdate: now,
    };
    const doc = await this.firebase.firestore.collection(`posts`).add(post);
    return new PostDbDto({
      ...post,
      id: doc.id,
    });
  }

  async update(
    id: string,
    userId: string,
    dto: PostUpdateDto,
  ): Promise<PostDbDto> {
    const post = await this.getOne(id);
    if (post.toJson().userId !== userId) {
      throw new ForbiddenException('user is not the owner');
    }
    const now = Timestamp.now();
    await this.firebase.firestore.doc(`posts/${id}`).update({
      ...dto,
      lastUpdate: now,
    });
    return new PostDbDto({
      ...post.toJson(),
      lastUpdate: now,
    });
  }
}

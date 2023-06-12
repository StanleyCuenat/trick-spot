import { Injectable, NotFoundException } from '@nestjs/common';
import { Timestamp } from 'firebase-admin/firestore';
import { InjectFirebaseAdmin } from 'src/firebase/firebase.decorator';
import { FirebaseAdmin } from 'src/firebase/firebase.interface';
import { PostService } from 'src/posts/posts.service';
import { PostLikeDbDto } from './dto/postLike-db.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostLikesService {
  private readonly firebase: FirebaseAdmin;
  constructor(
    @InjectFirebaseAdmin() firebase: FirebaseAdmin,
    private postService: PostService,
    private userService: UsersService,
  ) {
    this.firebase = firebase;
  }

  async getOne(id: string): Promise<PostLikeDbDto> {
    const postLikeSnap = await this.firebase.firestore
      .doc(`postLikes/${id}`)
      .get();
    if (!postLikeSnap.exists) {
      throw new NotFoundException(`post like ${id} not found`);
    }
    return new PostLikeDbDto({
      id: postLikeSnap.id,
      ...postLikeSnap.data(),
    });
  }

  async create(postId: string, userId: string): Promise<PostLikeDbDto> {
    const now = Timestamp.now();
    const post = await this.postService.getOne(postId);
    const user = await this.userService.getUser(userId);
    await this.firebase.firestore.doc(`postLikes/${postId}_${userId}`).set(
      {
        userId: userId,
        postId: post.toJson().id,
        username: user.toJson().nickname,
        createdAt: now,
      },
      { merge: true },
    );
    return new PostLikeDbDto({
      id: `${postId}_${userId}`,
      userId: userId,
      postId: post.toJson().id,
      username: user.toJson().nickname,
      createdAt: now,
    });
  }

  async delete(postId: string, userId: string): Promise<PostLikeDbDto> {
    const id = `${postId}_${userId}`;
    const postLike = await this.getOne(id);
    await this.firebase.firestore.doc(`postLikes/${id}`).delete();
    return postLike;
  }
}

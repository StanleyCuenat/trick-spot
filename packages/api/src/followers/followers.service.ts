import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectFirebaseAdmin } from 'src/firebase/firebase.decorator';
import { FirebaseAdmin } from 'src/firebase/firebase.interface';
import { FollowerDbDto } from './dto/followers-db.dto';
import { Timestamp } from 'firebase-admin/firestore';
import { UserDbDto } from 'src/users/dto/user-db.dto';

@Injectable()
export class FollowersService {
  private readonly firebase: FirebaseAdmin;
  constructor(@InjectFirebaseAdmin() firebase: FirebaseAdmin) {
    this.firebase = firebase;
  }

  async create(
    followerUser: UserDbDto,
    followedUser: UserDbDto,
  ): Promise<FollowerDbDto> {
    const id = `${followedUser.toJson().id}_${followerUser.toJson().id}`;
    const follow = await this.firebase.firestore.doc(`followers/${id}`).get();
    if (follow.exists === true) {
      throw new BadRequestException({
        id: id,
        error: 'already exist',
      });
    }
    const now = Timestamp.now();
    await this.firebase.firestore.doc(`followers/${id}`).set(
      {
        id: id,
        followerId: followerUser.toJson().id,
        followerUsername: followerUser.toJson().nickname,
        followedId: followedUser.toJson().id,
        createdAt: now,
      },
      { merge: true },
    );
    return new FollowerDbDto({
      id: id,
      followerId: followerUser.toJson().id,
      followerUsername: followerUser.toJson().nickname,
      followedId: followedUser.toJson().id,
      createdAt: now,
    });
  }
}

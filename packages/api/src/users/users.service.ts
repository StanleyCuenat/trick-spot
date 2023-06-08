import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectFirebaseAdmin } from 'src/firebase/firebase.decorator';
import { FirebaseAdmin } from 'src/firebase/firebase.interface';
import { UserCreateDto } from './dto/user-create.dto';
import * as admin from 'firebase-admin';
import { getUnixTime } from 'date-fns';
import { UserUpdateDto } from './dto/user-update.dto';
import { FirebaseUserEntity } from './interface/userFirebase.interface';

@Injectable()
export class UsersService {
  private readonly firebase: FirebaseAdmin;
  constructor(@InjectFirebaseAdmin() firebase: FirebaseAdmin) {
    this.firebase = firebase;
  }

  async create(
    userDto: UserCreateDto,
    id: string,
  ): Promise<FirebaseUserEntity> {
    const now = getUnixTime(new Date());
    const doc = await this.firebase.firestore.doc(`users/${id}`).get();
    const authUser = await this.firebase.auth.getUser(id);
    if (doc.exists === true) {
      throw new BadRequestException({
        id: id,
        error: 'already exist',
      });
    }
    await this.firebase.firestore.doc(`users/${id}`).create({
      ...userDto,
      banished: false,
      lastConnection: new admin.firestore.Timestamp(now, 0),
      lastUpdate: new admin.firestore.Timestamp(now, 0),
      email: authUser.email,
    });
    return {
      id: id,
      ...userDto,
      banished: false,
      lastConnection: new admin.firestore.Timestamp(now, 0),
      lastUpdate: new admin.firestore.Timestamp(now, 0),
      email: authUser.email,
    };
  }

  async update(
    userDto: UserUpdateDto,
    userId: string,
  ): Promise<FirebaseUserEntity> {
    const now = getUnixTime(new Date());
    const user = await this.firebase.firestore.doc(`users/${userId}`).get();
    if (!user.exists) {
      throw new NotFoundException(`doc ${userId} not found`);
    }
    await this.firebase.firestore.doc(`users/${userId}`).update({
      ...userDto,
      lastUpdate: new admin.firestore.Timestamp(now, 0),
    });
    return {
      id: user.id,
      ...user.data(),
      ...userDto,
    } as FirebaseUserEntity;
  }

  async updateImage(file: Express.Multer.File, userId: string): Promise<any> {
    const bucketFile = this.firebase.storage
      .bucket()
      .file(`users/${userId}/profile.jpeg`);
    await bucketFile.save(file.buffer, {
      contentType: 'image/jpeg',
    });
    return { url: `users/${userId}/profile.jpeg` };
  }

  async findOne(userId: string) {
    const snapshot = await this.firebase.firestore.doc(`users/${userId}`).get();
    if (!snapshot.exists) {
      throw new NotFoundException(`doc ${userId} not found`);
    }
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as FirebaseUserEntity;
  }
}

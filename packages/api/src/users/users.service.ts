import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectFirebaseAdmin } from 'src/firebase/firebase.decorator';
import { FirebaseAdmin } from 'src/firebase/firebase.interface';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserPatchDto } from './dto/user-patch.dto';
import { Timestamp } from 'firebase-admin/firestore';
import { FirebaseUserEntityDto } from './dto/user-firebase.dto';

@Injectable()
export class UsersService {
  private readonly firebase: FirebaseAdmin;
  constructor(@InjectFirebaseAdmin() firebase: FirebaseAdmin) {
    this.firebase = firebase;
  }

  async getUser(userId: string): Promise<FirebaseUserEntityDto> {
    const user = await this.firebase.firestore.doc(`users/${userId}`).get();
    if (!user.exists) {
      throw new NotFoundException(`doc ${userId} not found`);
    }
    return new FirebaseUserEntityDto({
      id: user.id,
      ...user.data(),
    });
  }

  async create(
    userDto: UserCreateDto,
    id: string,
  ): Promise<FirebaseUserEntityDto> {
    const now = Timestamp.now();
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
      lastConnection: now,
      lastUpdate: now,
      createdAt: now,
      email: authUser.email,
    });
    return new FirebaseUserEntityDto({
      id: id,
      ...userDto,
      banished: false,
      lastConnection: now,
      lastUpdate: now,
      createdAt: now,
      email: authUser.email,
    });
  }

  async update(
    userDto: UserUpdateDto,
    userId: string,
  ): Promise<FirebaseUserEntityDto> {
    const now = Timestamp.now();
    const user = await this.getUser(userId);
    await this.firebase.firestore.doc(`users/${userId}`).update({
      ...userDto,
      lastUpdate: now,
    });
    return new FirebaseUserEntityDto({
      ...user,
      ...userDto,
    });
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
    return this.getUser(userId);
  }

  async patch(userPatchDto: Partial<UserPatchDto>, userId: string) {
    const finalUserDto: Record<string, any> = {};
    finalUserDto.nickname = userPatchDto.nickname;
    finalUserDto.description = userPatchDto.description;
    finalUserDto.links = userPatchDto.links;
    finalUserDto.lastConnection = userPatchDto.lastConnection
      ? new Timestamp(userPatchDto.lastConnection, 0)
      : undefined;
    finalUserDto.lastUpdate = userPatchDto.lastUpdate
      ? new Timestamp(userPatchDto.lastUpdate, 0)
      : undefined;
    Object.keys(finalUserDto).forEach((key) => {
      if (!finalUserDto[key]) {
        delete finalUserDto[key];
      }
    });
    const user = await this.getUser(userId);
    await this.firebase.firestore.doc(`users/${userId}`).update(finalUserDto);
    return new FirebaseUserEntityDto({
      ...user,
      ...finalUserDto,
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectFirebaseAdmin } from 'src/firebase/firebase.decorator';
import { FirebaseAdmin } from 'src/firebase/firebase.interface';
import { TagDbDto } from './dto/tag-db.dto';
import { FieldValue } from 'firebase-admin/firestore';

@Injectable()
export class TagService {
  private readonly firebase: FirebaseAdmin;
  constructor(@InjectFirebaseAdmin() firebase: FirebaseAdmin) {
    this.firebase = firebase;
  }

  async createOrIncrement(tag: string): Promise<TagDbDto> {
    const docRef = this.firebase.firestore.doc(`tags/${tag}`);
    return this.firebase.firestore.runTransaction(async (t) => {
      const tagSnap = await t.get(docRef);
      if (!tagSnap.exists) {
        t.create(docRef, {
          tag: tag,
          totalPost: 1,
        });
        return new TagDbDto({
          id: tag,
          tag: tag,
          totalPost: 1,
        });
      } else {
        t.update(docRef, {
          totalPost: FieldValue.increment(1),
        });
        return new TagDbDto({
          id: tagSnap.id,
          ...tagSnap.data(),
          totalPost: tagSnap.data().totalPost + 1,
        });
      }
    });
  }

  async decrementTag(tag: string): Promise<TagDbDto> {
    const docRef = this.firebase.firestore.doc(`tags/${tag}`);
    return this.firebase.firestore.runTransaction(async (t) => {
      const tagSnap = await t.get(docRef);
      if (!tagSnap.exists) {
        throw new NotFoundException(`tag ${tag} does not exist`);
      }
      if (tagSnap.data().totalPost > 0) {
        t.update(docRef, {
          totalPost: FieldValue.increment(-1),
        });
      }
      return new TagDbDto({
        id: tagSnap.id,
        ...tagSnap.data(),
        totalPost:
          tagSnap.data().totalPost <= 0 ? 0 : tagSnap.data().totalPost - 1,
      });
    });
  }
}

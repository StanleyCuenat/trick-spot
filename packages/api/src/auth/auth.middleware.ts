import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthRequest } from 'src/core/interface/authRequest.interface';
import { InjectFirebaseAdmin } from 'src/firebase/firebase.decorator';
import { FirebaseAdmin } from 'src/firebase/firebase.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly firebase: FirebaseAdmin;
  constructor(@InjectFirebaseAdmin() firebase: FirebaseAdmin) {
    this.firebase = firebase;
  }

  async use(req: AuthRequest, _: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
      throw new HttpException(
        'No Bearer token Provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const { uid } = await this.firebase.auth.verifyIdToken(
        token.replace('Bearer ', ''),
      );
      req.userId = uid;
    } catch (e) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return next();
  }
}

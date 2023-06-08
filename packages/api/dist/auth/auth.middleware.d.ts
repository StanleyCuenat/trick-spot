import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthRequest } from 'src/core/core.interface';
import { FirebaseAdmin } from 'src/firebase/firebase.interface';
export declare class AuthMiddleware implements NestMiddleware {
    constructor(firebase: FirebaseAdmin);
    use(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

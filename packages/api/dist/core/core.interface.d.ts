import { Request as BaseRequest } from 'express';
export interface AuthRequest extends BaseRequest {
    userId: string;
}

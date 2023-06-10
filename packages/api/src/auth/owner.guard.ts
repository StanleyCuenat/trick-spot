import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/core/interface/authRequest.interface';

@Injectable()
export class OwnerAcl implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const resourceId = this.reflector.get<string>(
      'resourceId',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest() as AuthRequest;
    return request.params[resourceId] === request.userId;
  }
}

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [FollowersController],
  providers: [FollowersService],
  exports: [],
})
export class FollowersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(FollowersController);
  }
}

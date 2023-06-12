import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PostLikesService } from './postLikes.service';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { PostLikesController } from './postLikes.controller';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PostsModule, UsersModule],
  controllers: [PostLikesController],
  providers: [PostLikesService],
  exports: [],
})
export class PostLikesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PostLikesController);
  }
}

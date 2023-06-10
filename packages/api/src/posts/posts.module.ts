import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { PostsController } from './posts.controller';
import { PostService } from './posts.service';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostService],
})
export class PostsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PostsController);
  }
}

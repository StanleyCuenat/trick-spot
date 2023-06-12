import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { PostsController } from './posts.controller';
import { PostService } from './posts.service';
import { TagService } from 'src/tags/tags.service';
import { TagModule } from 'src/tags/tags.module';

@Module({
  imports: [TagModule],
  controllers: [PostsController],
  providers: [PostService, TagService],
})
export class PostsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PostsController);
  }
}

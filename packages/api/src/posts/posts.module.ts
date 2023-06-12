import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { PostsController } from './posts.controller';
import { PostService } from './posts.service';
import { TagsService } from 'src/tags/tags.service';
import { TagsModule } from 'src/tags/tags.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TagsModule, UsersModule],
  controllers: [PostsController],
  providers: [PostService, TagsService, UsersService],
  exports: [PostService],
})
export class PostsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PostsController);
  }
}

import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { PostLikesService } from './postLikes.service';
import { AuthRequest } from 'src/core/interface/authRequest.interface';
import { PostLikeEntity } from './postLikes.serializer';
import { PostService } from 'src/posts/posts.service';

@Controller()
export class PostLikesController {
  constructor(
    private postLikeService: PostLikesService,
    private postService: PostService,
  ) {}

  @Post('posts/:id/likes')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Param() params: { id: string }, @Req() req: AuthRequest) {
    const postLike = await this.postLikeService.create(params.id, req.userId);
    await this.postService.patch(params.id, {
      totalLikes: 1,
    });
    return new PostLikeEntity(postLike.toJson());
  }

  @Delete('posts/:id/likes')
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param() params: { id: string }, @Req() req: AuthRequest) {
    const postLike = await this.postLikeService.delete(params.id, req.userId);
    await this.postService.patch(params.id, {
      totalLikes: -1,
    });
    return new PostLikeEntity(postLike.toJson());
  }
}

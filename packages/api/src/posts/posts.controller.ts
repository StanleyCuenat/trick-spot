import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Put,
  Req,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from 'src/core/interface/authRequest.interface';
import { JoiValidationPipe } from 'src/core/validation.pipe';
import { PostService } from './posts.service';
import { PostCreateDto, postCreateSchema } from './dto/post-create.dto';
import { PostEntity } from './posts.serializer';
import { PostUpdateDto, postUpdateSchema } from './dto/post-update.dto';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(postCreateSchema))
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() body: PostCreateDto, @Req() req: AuthRequest) {
    const post = await this.postService.create(body, req.userId);
    return new PostEntity(post.toJson());
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(postUpdateSchema))
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Body() body: PostUpdateDto, @Req() req: AuthRequest) {
    const postUpdated = await this.postService.update(
      req.params.id,
      req.userId,
      body,
    );
    return new PostEntity(postUpdated.toJson());
  }
}

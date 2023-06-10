import { Body, Controller, Post, Req, UsePipes } from '@nestjs/common';
import { AuthRequest } from 'src/core/interface/authRequest.interface';
import { JoiValidationPipe } from 'src/core/validation.pipe';
import { PostService } from './posts.service';
import { PostCreateDto, postCreateSchema } from './dto/post-create.dto';
import { PostEntity } from './posts.serializer';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(postCreateSchema))
  async create(@Body() body: PostCreateDto, @Req() req: AuthRequest) {
    const post = await this.postService.create(body, req.userId);
    return new PostEntity(post.toJson());
  }
}

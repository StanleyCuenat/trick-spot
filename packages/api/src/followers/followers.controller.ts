import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { FollowersService } from './followers.service';
import { AuthRequest } from 'src/core/interface/authRequest.interface';
import { UsersService } from 'src/users/users.service';
import { FollowerEntity } from './followers.serializer';

@Controller()
export class FollowersController {
  constructor(
    private followersService: FollowersService,
    private usersService: UsersService,
  ) {}

  @Post('users/:id/followers')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Param() params: { id: string }, @Req() req: AuthRequest) {
    if (params.id === req.userId) {
      throw new BadRequestException();
    }
    const followedUser = await this.usersService.getUser(params.id);
    const followerUser = await this.usersService.getUser(req.userId);
    const follow = await this.followersService.create(
      followerUser,
      followedUser,
    );
    await this.usersService.updateTotalFollower(params.id, 1);
    return new FollowerEntity(follow.toJson());
  }
}

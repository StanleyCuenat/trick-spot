import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from 'src/core/core.interface';
import { UserCreateDto, userCreateSchema } from './dto/user-create.dto';
import { JoiValidationPipe } from 'src/core/validation.pipe';
import { UsersService } from './users.service';
import { UserUpdateDto, userUpdateSchema } from './dto/user-update.dto';
import { Owner } from 'src/auth/owner.decorator';
import { OwnerAcl } from 'src/auth/owner.guard';
import { UserEntity } from './users.serializer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserPatchDto, userPatchSchema } from './dto/user-patch.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Req() req: AuthRequest) {
    const user = await this.usersService.findOne(req.params.id);
    return new UserEntity(user.toJson());
  }

  @Post()
  @UsePipes(new JoiValidationPipe(userCreateSchema))
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Req() req: AuthRequest, @Body() userDto: UserCreateDto) {
    const newUser = await this.usersService.create(userDto, req.userId);
    return new UserEntity(newUser.toJson());
  }

  @Put(':id')
  @Owner('id')
  @UseGuards(OwnerAcl)
  @UsePipes(new JoiValidationPipe(userUpdateSchema))
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Req() req: AuthRequest, @Body() userDto: UserUpdateDto) {
    const updatedUser = await this.usersService.update(userDto, req.userId);
    return new UserEntity(updatedUser.toJson());
  }

  @Patch(':id')
  @Owner('id')
  @UseGuards(OwnerAcl)
  @UsePipes(new JoiValidationPipe(userPatchSchema))
  @UseInterceptors(ClassSerializerInterceptor)
  async patch(@Req() req: AuthRequest, @Body() userDto: UserPatchDto) {
    const updatedUser = await this.usersService.patch(userDto, req.userId);
    return new UserEntity(updatedUser.toJson());
  }

  @Put(':id/image')
  @Owner('id')
  @UseGuards(OwnerAcl)
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'jpeg' })
        .addMaxSizeValidator({ maxSize: 300000 })
        .build(),
    )
    file: Express.Multer.File,
    @Req() req: AuthRequest,
  ) {
    return await this.usersService.updateImage(file, req.userId);
  }
}

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  ParseFilePipeBuilder,
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
import { userUpdateSchema } from './dto/user-update.dto';
import { Owner } from 'src/auth/owner.decorator';
import { OwnerAcl } from 'src/auth/owner.guard';
import { UserEntity } from './users.serializer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(userCreateSchema))
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Req() req: AuthRequest, @Body() userDto: UserCreateDto) {
    const newUser = await this.usersService.create(userDto, req.userId);
    return new UserEntity(newUser);
  }

  @Put(':id')
  @Owner('id')
  @UseGuards(OwnerAcl)
  @UsePipes(new JoiValidationPipe(userUpdateSchema))
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Req() req: AuthRequest, @Body() userDto: UserCreateDto) {
    const updatedUser = await this.usersService.update(userDto, req.userId);
    return new UserEntity(updatedUser);
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
    try {
      return await this.usersService.updateImage(file, req.userId);
    } catch (e) {
      console.log(e);
    }
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Req() req: AuthRequest) {
    const user = await this.usersService.findOne(req.params.id);
    return new UserEntity(user);
  }
}

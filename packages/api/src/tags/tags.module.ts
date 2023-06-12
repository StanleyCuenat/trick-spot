import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}

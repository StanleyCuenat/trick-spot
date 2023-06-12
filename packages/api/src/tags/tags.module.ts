import { Module } from '@nestjs/common';
import { TagService } from './tags.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}

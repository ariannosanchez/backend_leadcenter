import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagCategoriesModule } from '../tag-categories/tag-categories.module';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [
    TypeOrmModule.forFeature([Tag]),
    TagCategoriesModule
  ],
  exports: [TypeOrmModule],
})
export class TagsModule {}

import { Module } from '@nestjs/common';
import { TagCategoriesService } from './tag-categories.service';
import { TagCategoriesController } from './tag-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagCategory } from './entities/tag-category.entity';

@Module({
  controllers: [TagCategoriesController],
  providers: [TagCategoriesService],
  imports: [
    TypeOrmModule.forFeature([ TagCategory ])
  ]
})
export class TagCategoriesModule {}

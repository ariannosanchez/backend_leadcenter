import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { TagCategoriesService } from './tag-categories.service';
import { CreateTagCategoryDto } from './dto/create-tag-category.dto';
import { UpdateTagCategoryDto } from './dto/update-tag-category.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('tag-categories')
export class TagCategoriesController {
  constructor(private readonly tagCategoriesService: TagCategoriesService) {}

  @Post()
  create(@Body() createTagCategoryDto: CreateTagCategoryDto) {
    return this.tagCategoriesService.create(createTagCategoryDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tagCategoriesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagCategoryDto: UpdateTagCategoryDto) {
    return this.tagCategoriesService.update(+id, updateTagCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagCategoriesService.remove(+id);
  }
}

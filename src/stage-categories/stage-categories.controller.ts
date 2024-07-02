import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from '../auth/decorators/auth.decorator';

import { StageCategoriesService } from './stage-categories.service';
import { CreateStageCategoryDto } from './dto/create-stage-category.dto';
import { UpdateStageCategoryDto } from './dto/update-stage-category.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { StageCategory } from './entities/stage-category.entity';

@ApiTags('Stage Categories')
@Controller('stage-categories')
@Auth()
export class StageCategoriesController {
  constructor(private readonly stageCategoriesService: StageCategoriesService) {}

  @Post()
  create(@Body() createStageCategoryDto: CreateStageCategoryDto) {
    return this.stageCategoriesService.create(createStageCategoryDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.stageCategoriesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stageCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStageCategoryDto: UpdateStageCategoryDto) {
    return this.stageCategoriesService.update(+id, updateStageCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stageCategoriesService.remove(+id);
  }
}

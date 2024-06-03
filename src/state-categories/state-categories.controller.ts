import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StateCategoriesService } from './state-categories.service';
import { CreateStateCategoryDto } from './dto/create-state-category.dto';
import { UpdateStateCategoryDto } from './dto/update-state-category.dto';

@Controller('state-categories')
export class StateCategoriesController {
  constructor(private readonly stateCategoriesService: StateCategoriesService) {}

  @Post()
  create(@Body() createStateCategoryDto: CreateStateCategoryDto) {
    return this.stateCategoriesService.create(createStateCategoryDto);
  }

  @Get()
  findAll() {
    return this.stateCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stateCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStateCategoryDto: UpdateStateCategoryDto) {
    return this.stateCategoriesService.update(+id, updateStateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stateCategoriesService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StagesService } from './stages.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('stages')
@Auth()
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Post()
  create(@Body() createStageDto: CreateStageDto) {
    return this.stagesService.create(createStageDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto ) {
    return this.stagesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStageDto: UpdateStageDto) {
    return this.stagesService.update(+id, updateStageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stagesService.remove(+id);
  }
}

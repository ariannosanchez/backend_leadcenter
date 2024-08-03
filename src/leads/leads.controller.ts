import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators';
import { User } from '../auth/entities/user.entity';
import { Lead } from './entities/lead.entity';
import { SearchDto } from '../common/dtos/search.dto';

@ApiTags('Leads')
@Controller('leads')
@Auth()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) { }

  @Post()
  @ApiResponse({ status: 201, description: 'Stage Category was created', type: Lead })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  create(
    @Body() createLeadDto: CreateLeadDto,
    @GetUser() user: User,
  ) {
    return this.leadsService.create(createLeadDto, user);
  }
  
  @Get('search')
  findBySearch(@Query() searchDto: SearchDto) {
    return this.leadsService.findMany(searchDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.leadsService.findAll(paginationDto);
  }

  @Get('funnel-report')
  getFunnelReport() {
    return this.leadsService.funneelReport();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadsService.remove(id);
  }

}

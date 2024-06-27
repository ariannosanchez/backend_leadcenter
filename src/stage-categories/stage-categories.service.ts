import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateStageCategoryDto } from './dto/create-stage-category.dto';
import { UpdateStageCategoryDto } from './dto/update-stage-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StageCategory } from './entities/stage-category.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class StageCategoriesService {

  private readonly logger = new Logger('StageCategoriesService');

  constructor(
    @InjectRepository(StageCategory)
    private readonly stageCategoryRepository: Repository<StageCategory>,
  ) {}

  async create(createStageCategoryDto: CreateStageCategoryDto) {
    try {
      const stageCategory = this.stageCategoryRepository.create(createStageCategoryDto);
      await this.stageCategoryRepository.save(stageCategory);
      
      return stageCategory;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.stageCategoryRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number) {
    const stageCategory = await this.stageCategoryRepository.findOneBy({id});

    if ( !stageCategory )
      throw new NotFoundException(`StageCategory with id ${id} not found`);

    return stageCategory;
  }

  async update(id: number, updateStageCategoryDto: UpdateStageCategoryDto) {
    const stageCategory = await this.stageCategoryRepository.preload({
      id,
      ...updateStageCategoryDto
    });

    if ( !stageCategory ) throw new NotFoundException(`StageCategory with id ${id} not found`);

    try {
      await this.stageCategoryRepository.save(stageCategory);
      return stageCategory;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const stageCategory = await this.findOne(id);

    await this.stageCategoryRepository.remove(stageCategory);
  }

  private handleDBExceptions(error: any){
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server log');
  }
}

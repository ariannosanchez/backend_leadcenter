import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stage } from './entities/stage.entity';
import { DataSource, Repository } from 'typeorm';
import { StageCategory } from '../stage-categories/entities/stage-category.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class StagesService {

  private readonly logger = new Logger('StagesService')

  constructor(
    @InjectRepository(Stage)
    private readonly stageRepository: Repository<Stage>,

    @InjectRepository(StageCategory)
    private readonly stageCategoryRepository: Repository<StageCategory>,

  ) { }

  async create(createStageDto: CreateStageDto) {
    
    const stageCategory = await this.stageCategoryRepository.findOneBy({
      id: createStageDto.stageCategory,
    });

    if ( !stageCategory )
      throw new NotFoundException(`StageCategory with id ${createStageDto.stageCategory} not found`);

    try {
      const stage = this.stageRepository.create({
        ...createStageDto,
        stageCategory,
      });

      return await this.stageRepository.save(stage);
    
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.stageRepository.find({
      take: limit,
      skip: offset,
      relations: ['stageCategory']
    });
  }

  async findOne(id: number) {
    const stage = await this.stageRepository.findOneBy({ id });

    if ( !stage )
      throw new NotFoundException(`Stage with id ${id} not found`);

    return stage;
  }

  async update(id: number, updateStageDto: UpdateStageDto) {
    
    const stage = await this.findOne(id);

    const stageCategory = await this.stageCategoryRepository.findOneBy({
      id: updateStageDto.stageCategory,
    });

    if ( !stageCategory )
      throw new NotFoundException(`StageCategory with id ${updateStageDto.stageCategory} not found`);

    try {
      const updateStage = await this.stageRepository.save({
        ...stage,
        ...updateStageDto,
        stageCategory
      });
      
      return await this.stageRepository.save(updateStage);
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async remove(id: number) {
    const stage = await this.findOne(id);

    await this.stageRepository.remove(stage);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server log');
  }
}

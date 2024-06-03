import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateStateCategoryDto } from './dto/create-state-category.dto';
import { UpdateStateCategoryDto } from './dto/update-state-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StateCategory } from './entities/state-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StateCategoriesService {

  private readonly logger = new Logger('StateCategoriesService');

  constructor(
    @InjectRepository(StateCategory)
    private readonly stateCategoryRepository: Repository<StateCategory>,
  ) { }

  async create(createStateCategoryDto: CreateStateCategoryDto) {
    try {
      const stateCategory = this.stateCategoryRepository.create(createStateCategoryDto);
      await this.stateCategoryRepository.save(stateCategory);

      return stateCategory;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.stateCategoryRepository.find({});
  }

  async findOne(id: number) {
    const stateCategory = await this.stateCategoryRepository.findOneBy({ id });

    if (!stateCategory)
      throw new NotFoundException(`StateCategory with id ${id} not found`);

    return stateCategory;
  }

  async update(id: number, updateStateCategoryDto: UpdateStateCategoryDto) {
    const stateCategory = await this.stateCategoryRepository.preload({
      id,
      ...updateStateCategoryDto
    });

    if (!stateCategory) throw new NotFoundException(`StateCategory with id ${id} not found`);

    try {
      await this.stateCategoryRepository.save(stateCategory);
      return stateCategory;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const stateCategory = await this.findOne(id);

    await this.stateCategoryRepository.remove(stateCategory);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server log');
  }
}

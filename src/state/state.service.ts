import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateStateDto, UpdateStateDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { DataSource, Repository } from 'typeorm';
import { StateCategory } from '../state-categories/entities/state-category.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class StateService {

  private readonly logger = new Logger('StateService');

  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,

    @InjectRepository(StateCategory)
    private readonly stateCategoryRepository: Repository<StateCategory>,

    private readonly dataSource: DataSource,
  ) { }

  async create(createStateDto: CreateStateDto): Promise<State> {
    const stateCategory = await this.stateCategoryRepository.findOneBy({
      id: createStateDto.stateCategory,
    })

    if (!stateCategory) {
      throw new NotFoundException(`State category with id ${createStateDto.stateCategory} not found`);
    }

    try {
      const state = this.stateRepository.create({
        ...createStateDto,
        stateCategory
      });

      return await this.stateRepository.save(state);;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    return this.stateRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number): Promise<State> {

    const state = await this.stateRepository.findOneBy({ id });

    if (!state) throw new NotFoundException(`State with id ${id} not found`);

    return state;
  }

  async update(id: number, updateStateDto: UpdateStateDto) {

    const { stateCategory, ...toUpdate } = updateStateDto;

    const state = await this.stateRepository.preload({ id, ...toUpdate });

    if (!state) throw new NotFoundException(`State with id: ${id} not found`);

    //Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    if (stateCategory) {
      const category = await queryRunner.manager.findOne(StateCategory, {
        where: { id: stateCategory },
      });

      if (!category) throw new NotFoundException(`State category with id ${stateCategory} not found`);

      state.stateCategory = category;
    }
    try {
    
      await queryRunner.manager.save(state);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return state;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  // async update(id: number, updateStateDto: UpdateStateDto) {

  //   const stateCategory = await this.stateCategoryRepository.findOneBy({
  //     id: updateStateDto.stateCategory,
  //   })

  //   if (!stateCategory) throw new NotFoundException(`State category with id ${updateStateDto.stateCategory} not found`);


  //   const state = await this.stateRepository.preload({
  //     id,
  //     ...updateStateDto,
  //     stateCategory
  //   });

  //   if (!state) throw new NotFoundException(`State with id ${id} not found`);

  //   try {
  //     await this.stateRepository.save(state);
  //     return state;
  //   } catch (error) {
  //     this.handleDBExceptions(error)
  //   }
  // }

  async remove(id: number) {

    const state = await this.findOne(id);

    await this.stateRepository.remove(state);
  }

  private handleDBExceptions(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(`Unexpected error, check server log`);
  }
}

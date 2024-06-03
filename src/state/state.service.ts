import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { Repository } from 'typeorm';
import { StateCategory } from '../state-categories/entities/state-category.entity';

@Injectable()
export class StateService {

  private readonly logger = new Logger('StateService');

  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,

    @InjectRepository(StateCategory)
    private readonly stateCategoryRepository: Repository<StateCategory>,
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

  findAll() {
    return this.stateRepository.find({})
  }

  async findOne(id: number): Promise<State> {

    const state = await this.stateRepository.findOneBy({ id });

    if (!state) throw new NotFoundException(`State with id ${id} not found`);

    return state;
  }

  async update(id: number, updateStateDto: UpdateStateDto) {
    return `This action updates a #${id} state`;
  }

  remove(id: number) {
    return `This action removes a #${id} state`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(`Unexpected error, check server log`);
  }
}

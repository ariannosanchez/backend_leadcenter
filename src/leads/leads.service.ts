import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Tag } from '../tags/entities/tag.entity';
import { State } from '../state/entities/state.entity';

@Injectable()
export class LeadsService {

  private readonly logger = new Logger('LeadsService');

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,

    private readonly dataSource: DataSource,
  ) { }

  async create(createLeadDto: CreateLeadDto) {

    const tag = await this.tagRepository.findOneBy({
      id: createLeadDto.tag,
    });

    if (!tag)
      throw new NotFoundException(`Tag with id ${createLeadDto.tag} not found`);

    const state = await this.stateRepository.findOneBy({
      id: createLeadDto.state,
    });

    if (!state)
      throw new NotFoundException(`State with id ${createLeadDto.state} not found`);

    try {
      const lead = this.leadRepository.create({
        ...createLeadDto,
        tag,
        state,
      });

      return await this.leadRepository.save(lead);

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.leadRepository.find({
      take: limit,
      skip: offset,
      relations: ['tag', 'state']
    });
  }

  async findOne(id: string) {
    const lead = await this.leadRepository.findOneBy({ id });

    if (!lead)
      throw new NotFoundException(`Product with id ${id} not found`);

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {

    const { tag, state, ...toUpdate } = updateLeadDto;

    const lead = await this.leadRepository.preload({ id, ...toUpdate });

    if (!lead) throw new NotFoundException(`Lead with id ${id} not found`);

    //Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (tag) {
        
      }
    } catch (error) {
      
    }

    // const lead = await this.leadRepository.preload({
    //   id,
    //   ...updateLeadDto
    // });

    // if (!lead) throw new NotFoundException(`Lead with id: ${id} not found`);

    // try {
    //   await this.leadRepository.save(lead);
    //   return lead;

    // } catch (error) {
    //   this.handleDBExceptions(error);
    // }



  }

  async remove(id: string) {
    const lead = await this.findOne(id);

    await this.leadRepository.remove(lead);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server log');
  }
}

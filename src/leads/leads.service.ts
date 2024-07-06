import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Query } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Tag } from '../tags/entities/tag.entity';
import { User } from '../auth/entities/user.entity';
import { Stage } from '../stages/entities/stage.entity';
import { SearchDto } from '../common/dtos/search.dto';

@Injectable()
export class LeadsService {

  private readonly logger = new Logger('LeadsService');

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(Stage)
    private readonly stageRepository: Repository<Stage>,

    private readonly dataSource: DataSource,
  ) { }

  async create(createLeadDto: CreateLeadDto, user: User) {

    const tag = await this.tagRepository.findOneBy({
      id: createLeadDto.tag,
    });

    if (!tag)
      throw new NotFoundException(`Tag with id ${createLeadDto.tag} not found`);

    const stage = await this.stageRepository.findOneBy({
      id: createLeadDto.stage,
    });

    if (!stage)
      throw new NotFoundException(`Stage with id ${createLeadDto.stage} not found`);

    try {
      const lead = this.leadRepository.create({
        ...createLeadDto,
        tag,
        stage,
        user,
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
      relations: ['tag', 'stage']
    });
  }

  async findMany(searchDto: SearchDto) {
    const { name, lastName, phone, stageId, tagId, limit = 10, offset = 0 } = searchDto;
    const conditions: FindOptionsWhere<Lead> | FindOptionsWhere<Lead>[] = {
      ...(name ? { name } : {}),
      ...(lastName ? { lastName } : {}),
      ...(phone ? { phone } : {}),
      ...(stageId ? { stage: { id: stageId } } : {}),
      ...(tagId ? { tag: { id: tagId } } : {}),
    };

    return await this.leadRepository.find({
      where: conditions,
      take: limit,
      skip: offset,
      relations: ['tag', 'stage']
    });
  }

  async findOne(id: string) {
    const lead = await this.leadRepository.findOneBy({ id });

    if (!lead)
      throw new NotFoundException(`Product with id ${id} not found`);

    return lead;
  }
  
  async update(id: string, updateLeadDto: UpdateLeadDto) {

    const lead = await this.leadRepository.findOneBy({ id });

    if (!lead) throw new NotFoundException(`Lead with id ${id} not found`);

    let tag: Tag;

    if (updateLeadDto.tag) {
      tag = await this.tagRepository.findOneBy({
        id: updateLeadDto.tag,
      });

      if (!tag) throw new NotFoundException(`Tag with id ${updateLeadDto.tag} not found`);
    }

    let stage: Stage;

    if (updateLeadDto.stage) {
      stage = await this.stageRepository.findOneBy({
        id: updateLeadDto.stage,
      });

      if (!stage) throw new NotFoundException(`State with id ${updateLeadDto.stage} not found`);
    }

    try {

      const updateLead = await this.leadRepository.save({
        ...lead,
        ...updateLeadDto,
        tag,
        stage,
      });

      return await this.leadRepository.save(updateLead);

    } catch (error) {
      this.handleDBExceptions(error);
    }

    // const { tag, state, ...toUpdate } = updateLeadDto;

    // const lead = await this.leadRepository.preload({ id, ...toUpdate });

    // if (!lead) throw new NotFoundException(`Lead with id ${id} not found`);

    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    // try {
    //   if (tag) {
    //     const tagId = await queryRunner.manager.findOne(Tag, {
    //       where: { id: tag },
    //     });

    //     if (!tag) throw new NotFoundException(`Tag with id ${tag} not found`);

    //     lead.tag = tagId;
    //   }

    //   if (state) {
    //     const stateId = await queryRunner.manager.findOne(State, {
    //       where: { id: state },
    //     });

    //     if (!state) throw new NotFoundException(`State with id ${state} not found`);

    //     lead.state = stateId;
    //   }

    //   await queryRunner.manager.save(lead);
    //   await queryRunner.commitTransaction();
    //   await queryRunner.release();

    //   return lead;

    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    //   await queryRunner.release();

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
    console.log(error);
    throw new InternalServerErrorException('Unexpected error, check server log');
  }
}

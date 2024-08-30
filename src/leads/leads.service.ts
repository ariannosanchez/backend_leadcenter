import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Query } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
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
      id: createLeadDto.tagId,
    });

    if (!tag)
      throw new NotFoundException(`Tag with id ${createLeadDto.tagId} not found`);

    const stage = await this.stageRepository.findOneBy({
      id: createLeadDto.stageId,
    });

    if (!stage)
      throw new NotFoundException(`Stage with id ${createLeadDto.stageId} not found`);

    

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

  // async findMany(searchDto: SearchDto) {
  //   const { startDate, endDate, stageId, tagId, limit = 10, offset = 0 } = searchDto;
  //   const conditions: FindOptionsWhere<Lead> | FindOptionsWhere<Lead>[] = {
  //     ...(stageId ? { stage: { id: stageId } } : {}),
  //     ...(tagId ? { tag: { id: tagId } } : {}),
  //   };

  //   if ( startDate && endDate ) {
  //     conditions.createdAt = Between( startDate, endDate );
  //   }

  //   return await this.leadRepository.find({
  //     where: conditions,
  //     order: { createdAt: 'DESC'},
  //     take: limit, 
  //     skip: offset,
  //     relations: ['tag', 'stage']
  //   });
  // }

  async findMany(searchDto: SearchDto) {
    const { limit = 10, offset = 0, tagId, stageId, startDate, endDate } = searchDto;

    const queryBuilder = this.leadRepository.createQueryBuilder('lead')
      .leftJoinAndSelect('lead.tag', 'tag')
      .leftJoinAndSelect('tag.tagCategory', 'tagCategory')
      .leftJoinAndSelect('lead.stage', 'stage')
      .leftJoinAndSelect('stage.stageCategory', 'stageCategory')
      .leftJoinAndSelect('lead.user', 'user')
      .take(limit)
      .skip(offset);

    if (tagId) {
      queryBuilder.andWhere('lead.tagId = :tagId', { tagId });
    }

    if (stageId) {
      queryBuilder.andWhere('lead.stageId = :stageId', { stageId });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('lead.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    } else if (startDate) {
      queryBuilder.andWhere('lead.createdAt >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('lead.createdAt <= :endDate', { endDate });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string) {
    const lead = await this.leadRepository.findOneBy({ id });

    if (!lead)
      throw new NotFoundException(`Product with id ${id} not found`);

    return lead;
  }
  
  // async update(id: string, updateLeadDto: UpdateLeadDto) {

  //   const lead = await this.leadRepository.findOneBy({ id });

  //   if (!lead) throw new NotFoundException(`Lead with id ${id} not found`);

  //   let tag: Tag;

  //   if (updateLeadDto.tagId) {
  //     tag = await this.tagRepository.findOneBy({
  //       id: updateLeadDto.tagId,
  //     });

  //     if (!tag) throw new NotFoundException(`Tag with id ${updateLeadDto.tagId} not found`);
  //   }

  //   let stage: Stage;

  //   if (updateLeadDto.stageId) {
  //     stage = await this.stageRepository.findOneBy({
  //       id: updateLeadDto.stageId,
  //     });

  //     if (!stage) throw new NotFoundException(`State with id ${updateLeadDto.stageId} not found`);
  //   }

  //   try {

  //     const updateLead = await this.leadRepository.save({
  //       ...lead,
  //       ...updateLeadDto,
  //       tag,
  //       stage,
  //     });

  //     return await this.leadRepository.save(updateLead);

  //   } catch (error) {
  //     this.handleDBExceptions(error);
  //   }

  // }

  async update(id: string, updateLeadDto: UpdateLeadDto) {

    const lead = await this.leadRepository.findOneBy({ id });

    if (!lead) throw new NotFoundException(`Lead with id ${id} not found`);

    const updates: Partial<Lead> = { ...updateLeadDto };

    if (updateLeadDto.tagId) {
      const tag = await this.tagRepository.findOneBy({
        id: updateLeadDto.tagId,
      });

      if (!tag) throw new NotFoundException(`Tag with id ${updateLeadDto.tagId} not found`);
    
      updates.tag = tag;
    }

    if (updateLeadDto.stageId) {
      const stage = await this.stageRepository.findOneBy({
        id: updateLeadDto.stageId,
      });

      if (!stage) throw new NotFoundException(`State with id ${updateLeadDto.stageId} not found`);
    
      updates.stage = stage;
    }

    try {

      const updateLead = await this.leadRepository.save({
        ...lead,
        ...updates,
      });

      return updateLead;

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    const lead = await this.findOne(id);

    await this.leadRepository.remove(lead);
  }

  async funneelReport() {
    const stages = await this.stageRepository.find();
    const report = [];

    for ( const stage of stages ) {
      const count = await this.leadRepository.count({ where: { stage: { id: stage.id } } });
      report.push({ stage: stage, count });
    }

    return report;
  }

  async findByStage(stageId: number) {
    const stage = await this.stageRepository.findOneBy({ id: stageId });
    if ( !stage ) 
      throw new NotFoundException(`Stage with id ${stageId} not found`);

    return this.leadRepository.find({
      where: { stage: { id: stageId } },
      relations: ['tag', 'user', 'stage'],
    })
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    console.log(error);
    throw new InternalServerErrorException('Unexpected error, check server log');
  }
}

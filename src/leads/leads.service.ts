import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class LeadsService {

  private readonly logger = new Logger('LeadsService');

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) { }

  async create(createLeadDto: CreateLeadDto) {

    try {

      const lead = this.leadRepository.create(createLeadDto);
      await this.leadRepository.save(lead);

      return lead;

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    return this.leadRepository.find({
      take: limit,
      skip: offset,
      //TODO: relaciones
    });
  }

  async findOne(id: string) {
    const lead = await this.leadRepository.findOneBy({ id });

    if (!lead)
      throw new NotFoundException(`Product with id ${id} not found`);

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {

    const lead = await this.leadRepository.preload({
      id,
      ...updateLeadDto
    });

    if (!lead) throw new NotFoundException(`Lead with id: ${id} not found`);

    try {
      await this.leadRepository.save(lead);
      return lead;

    } catch (error) {
      this.handleDBExceptions(error);
    }

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

import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTagCategoryDto } from './dto/create-tag-category.dto';
import { UpdateTagCategoryDto } from './dto/update-tag-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TagCategory } from './entities/tag-category.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TagCategoriesService {

  private readonly logger = new Logger('TagCategoriesService');

  constructor(
    @InjectRepository(TagCategory)
    private readonly tagCategoryRepository: Repository<TagCategory>,
  ) { }

  async create(createTagCategoryDto: CreateTagCategoryDto) {
    try {
      const tagCategory = this.tagCategoryRepository.create(createTagCategoryDto);
      await this.tagCategoryRepository.save(tagCategory);

      return tagCategory;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.tagCategoryRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number) {
    const tagCategory = await this.tagCategoryRepository.findOneBy({ id });

    if (!tagCategory)
      throw new NotFoundException(`TagCategory with id ${id} not found`);

    return tagCategory;
  }

  async update(id: number, updateTagCategoryDto: UpdateTagCategoryDto) {
    const tagCategory = await this.tagCategoryRepository.preload({
      id,
      ...updateTagCategoryDto
    });

    if (!tagCategory) throw new NotFoundException(`TagCategory with id ${id} not found`);

    try {
      await this.tagCategoryRepository.save(tagCategory);
      return tagCategory;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const tagCategory = await this.findOne(id);

    await this.tagCategoryRepository.remove(tagCategory);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server log');
  }
}

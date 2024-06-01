import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTagCategoryDto } from './dto/create-tag-category.dto';
import { UpdateTagCategoryDto } from './dto/update-tag-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TagCategory } from './entities/tag-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagCategoriesService {

  private readonly logger = new Logger('TagCategoriesService');

  constructor(
    @InjectRepository(TagCategory)
    private readonly tagCategoryRepository: Repository<TagCategory>,
  ){}

  async create(createTagCategoryDto: CreateTagCategoryDto) {
    try {
      const tagCategory = this.tagCategoryRepository.create(createTagCategoryDto);
      await this.tagCategoryRepository.save(tagCategory);

      return tagCategory;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all tagCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tagCategory`;
  }

  update(id: number, updateTagCategoryDto: UpdateTagCategoryDto) {
    return `This action updates a #${id} tagCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} tagCategory`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server log');
  }
}

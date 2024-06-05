import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { DataSource, Repository } from 'typeorm';
import { TagCategory } from '../tag-categories/entities/tag-category.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TagsService {

  private readonly logger = new Logger('TagService');

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(TagCategory)
    private readonly tagCategoryRepository: Repository<TagCategory>,

    private readonly dataSource: DataSource,
  ) { }


  async create(createTagDto: CreateTagDto) {
    const tagCategory = await this.tagCategoryRepository.findOneBy({
      id: createTagDto.tagCategory,
    });

    if (!tagCategory)
      throw new NotFoundException(`Tag category with id ${tagCategory} not found`);

    try {
      const tag = this.tagRepository.create({
        ...createTagDto,
        tagCategory
      });

      return await this.tagRepository.save(tag);

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.tagRepository.find({
      take: limit,
      skip: offset,
      relations: ['tagCategory']
    })
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.findOneBy({ id });

    if (!tag) throw new NotFoundException(`Tag with id ${id} not found`);

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const { tagCategory, ...toUpdate } = updateTagDto;

    const tag = await this.tagRepository.preload({ id, ...toUpdate });

    if (!tag) throw new NotFoundException(`Tag with id ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (tagCategory) {
        const newTagCategory = await queryRunner.manager.findOne(TagCategory, {
          where: { id: tagCategory },
        });

        if (!newTagCategory) throw new NotFoundException(`Tag category with id ${id} not found`);

        tag.tagCategory = newTagCategory;
      }

      await queryRunner.manager.save(tag);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return tag;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }

  }

  async remove(id: number) {
    const tag = await this.findOne(id);

    await this.tagRepository.remove(tag);
  }

  private handleDBExceptions(error: any) {

    if (error.code === '23503') // Violación de restricción de clave externa
      throw new BadRequestException('Cannot update or delete due to foreign key constraint');

    this.logger.error(error)
    throw new InternalServerErrorException(`Unexpected error, check server log`);
  }

}

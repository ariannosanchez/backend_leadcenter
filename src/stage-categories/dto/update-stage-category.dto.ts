import { PartialType } from '@nestjs/mapped-types';
import { CreateStageCategoryDto } from './create-stage-category.dto';

export class UpdateStageCategoryDto extends PartialType(CreateStageCategoryDto) {}

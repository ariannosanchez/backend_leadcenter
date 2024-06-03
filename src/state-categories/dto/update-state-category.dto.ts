import { PartialType } from '@nestjs/mapped-types';
import { CreateStateCategoryDto } from './create-state-category.dto';

export class UpdateStateCategoryDto extends PartialType(CreateStateCategoryDto) {}

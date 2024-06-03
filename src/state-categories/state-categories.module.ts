import { Module } from '@nestjs/common';
import { StateCategoriesService } from './state-categories.service';
import { StateCategoriesController } from './state-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateCategory } from './entities/state-category.entity';

@Module({
  controllers: [StateCategoriesController],
  providers: [StateCategoriesService],
  imports: [
    TypeOrmModule.forFeature([StateCategory])
  ],
  exports: [TypeOrmModule],
})
export class StateCategoriesModule { }

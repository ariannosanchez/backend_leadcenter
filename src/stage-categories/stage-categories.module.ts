import { Module } from '@nestjs/common';
import { StageCategoriesService } from './stage-categories.service';
import { StageCategoriesController } from './stage-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StageCategory } from './entities/stage-category.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [StageCategoriesController],
  providers: [StageCategoriesService],
  imports: [
    TypeOrmModule.forFeature([ StageCategory ]),
    AuthModule,
  ],
  exports: [TypeOrmModule],
})
export class StageCategoriesModule {}

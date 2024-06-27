import { Module } from '@nestjs/common';
import { StagesService } from './stages.service';
import { StagesController } from './stages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stage } from './entities/stage.entity';
import { AuthModule } from '../auth/auth.module';
import { StageCategoriesModule } from '../stage-categories/stage-categories.module';

@Module({
  controllers: [StagesController],
  providers: [StagesService],
  imports: [
    TypeOrmModule.forFeature([Stage]),
    StageCategoriesModule,
    AuthModule,
  ],
  exports: [TypeOrmModule]
})
export class StagesModule {}

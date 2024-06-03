import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { StateCategoriesModule } from '../state-categories/state-categories.module';
import { StateCategoriesService } from '../state-categories/state-categories.service';

@Module({
  controllers: [StateController],
  providers: [StateService, StateCategoriesService],
  imports: [
    TypeOrmModule.forFeature([State]), StateCategoriesModule
  ]
})
export class StateModule { }

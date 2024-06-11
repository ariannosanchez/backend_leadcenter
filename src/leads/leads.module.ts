import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';
import { TagsModule } from '../tags/tags.module';
import { StateModule } from '../state/state.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService],
  imports: [
    TypeOrmModule.forFeature([Lead]),
    TagsModule,
    StateModule,
    AuthModule,
  ],
  exports: [TypeOrmModule],
})
export class LeadsModule { }

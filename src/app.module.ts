import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsModule } from './leads/leads.module';
import { CommonModule } from './common/common.module';
import { TagCategoriesModule } from './tag-categories/tag-categories.module';
import { StateCategoriesModule } from './state-categories/state-categories.module';
import { StateModule } from './state/state.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CommonModule,
    LeadsModule,
    TagCategoriesModule,
    StateCategoriesModule,
    StateModule,
    TagsModule,
    AuthModule,
  ],
})
export class AppModule {}

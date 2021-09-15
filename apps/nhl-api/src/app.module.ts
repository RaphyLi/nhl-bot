import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { KnexModule } from 'nestjs-knex';
import { FranchiseController } from './franchise/franchise.controller';
import { FranchiseService } from './franchise/franchise.service';
import { ScheduleService } from './schedule/schedule.service';
import { SeasonService } from './season/season.service';
import { TeamService } from './team/team.service';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    KnexModule.forRoot({
      config: {
        client: 'mysql',
        debug: Boolean(process.env.DEBUG || false),
        useNullAsDefault: true,
        connection: {
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
        },
        migrations: {
          directory: 'migrations',
          tableName: 'knex_migrations',
        },
      },
    }),
  ],
  controllers: [FranchiseController],
  providers: [FranchiseService, ScheduleService, SeasonService, TeamService],
})
export class AppModule {}

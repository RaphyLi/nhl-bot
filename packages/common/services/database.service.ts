import { Knex, knex } from 'knex';
import { Injectable } from '@nhl/core';

@Injectable()
export class DatabaseService {
  public knex: Knex;

  public connect() {
    this.knex = knex({
      debug: Boolean(process.env.DEBUG || false),
      client: 'mysql',
      connection: {
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
      }
    });
  }
}

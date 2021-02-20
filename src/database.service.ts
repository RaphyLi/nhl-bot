import { Injectable } from './di/decorators/injectable';
import Knex = require('knex');
import mysql = require('mysql');

@Injectable()
export class DatabaseService {
    public knex: Knex;

    public connect() {
        this.knex = Knex({
            debug: Boolean(process.env.DEBUG || false),
            client: 'mysql',
            connection: {
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            },
        });
    }
}

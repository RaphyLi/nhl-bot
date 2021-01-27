import mysql = require('mysql');

export class DatabaseService {
    private con: mysql.Connection;

    constructor() {
        this.con = mysql.createConnection({
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
    }

    public connection() {
        this.con.connect((err) => {
            if (err) {
                throw err;
            }
            console.log("💡 Database is connected!");
        });
    }

    public query(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.con.query(query, (error, results, fields) => {
                resolve(results);
            });
        });
    }
}

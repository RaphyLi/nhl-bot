// Update with your config settings.

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'nhl',
      password: 'nhl2021',
      database: 'nhl'
    },
    migrations: {
      directory: 'migrations',
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "mysql",
    connection: {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

};

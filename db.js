import knex from 'knex';
import env from 'dotenv';

env.config();

const db = knex({
    client: process.env.DB_CONNECTION,
    connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    }
});

export default db;

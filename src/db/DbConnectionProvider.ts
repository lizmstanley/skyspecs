import { Pool, PoolClient } from 'pg';

//Normally I wouldn't make this a global, this is done in the interest
//of simplicity/time. Ideally I'd make this an injectable component.
//Also I'd do some error checking around these environment variables
require('dotenv').config();
const dbPool: Pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}).on('error', (err: Error, client: PoolClient) => {
    console.error(`Db pool error: ${err.message}`);
});


export async function getDbConnection(): Promise<PoolClient> {
    return dbPool.connect();
}

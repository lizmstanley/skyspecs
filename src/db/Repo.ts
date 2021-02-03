/*
 * Normally this would be an injectable component
 * We'd possibly use an ORM, or separate out the SQL queries so they're not
 * embedded in the code.
 * Using parameterized queries to prevent sql injection
 */
import { getDbConnection } from './DbConnectionProvider';
import { PoolClient, QueryResult, QueryResultRow } from 'pg';
import { Gist } from '../gist/GistWrapper';
import { DbUserGist } from './Model';

export async function queryGist(gistId: string): Promise<DbUserGist | null> {
    const dbConnection: PoolClient = await getDbConnection();
    try {
        const queryResult: QueryResult = await dbConnection.query(
            'select skyspecs_user_gist.id as user_gist_id, skyspecs_user.id as user_id' +
                'gist_id, is_favorite, username ' +
                'from skyspecs_user_gist, skyspecs_user ' +
                'where gist_id=$1 ' +
                'and user_id=skyspecs_user.id',
            [gistId],
        );
        if (!queryResult || !queryResult.rows.length) {
            return null;
        }
        //there should only be one...
        return mapRow(queryResult.rows[0]);
    } catch (error) {
        console.error(`Db query error: ${error.message}`);
        return null;
    } finally {
        dbConnection.release();
    }
}

export async function queryUserGists(username: string): Promise<DbUserGist[]> {
    const dbConnection: PoolClient = await getDbConnection();
    try {
        const queryResult: QueryResult = await dbConnection.query(
            'select skyspecs_user_gist.id as user_gist_id, skyspecs_user.id as user_id' +
                'gist_id, is_favorite, username ' +
                'from skyspecs_user_gist, skyspecs_user ' +
                'where username=$1 ' +
                'and user_id=skyspecs_user.id',
            [username],
        );
        if (!queryResult || !queryResult.rows.length) {
            return [];
        }
        return queryResult.rows.map((row) => mapRow(row));
    } catch (error) {
        console.error(`Db query error: ${error.message}`);
        return [];
    } finally {
        dbConnection.release();
    }
}

export async function insertGist(gist: Gist): Promise<boolean> {
    const dbConnection: PoolClient = await getDbConnection();
    //start transaction
    try {
        await dbConnection.query('BEGIN');
        //postgres "upsert"
        const upsertResult: QueryResult = await dbConnection.query(
            'insert into skyspecs_user(username) values($1) on conflict do nothing returning id',
            [gist.owner.login],
        );
        if (upsertResult && upsertResult.rows.length) {
            await dbConnection.query('insert into skyspecs_user_gist(gist_id, user_id) values($1,$2)', [
                gist.id,
                upsertResult.rows[0].id,
            ]);
        } else {
            await dbConnection.query(
                'insert into skyspecs_user_gist(gist_id,user_id) ' +
                    'select $1,su.id ' +
                    'from skyspecs_user su ' +
                    'where su.username=$2',
                [gist.id, gist.owner.login],
            );
        }
        await dbConnection.query('COMMIT');
        return true;
    } catch (error) {
        await dbConnection.query('ROLLBACK');
    } finally {
        dbConnection.release();
    }
    return false;
}

export async function updateGist(gistId: string, isFavorite: boolean): Promise<void> {
    const dbConnection: PoolClient = await getDbConnection();
    try {
        await dbConnection.query('update skyspecs_user_gist set is_favorite=$1 where gist_id=$2', [isFavorite, gistId]);
    } finally {
        dbConnection.release();
    }
}

function mapRow(row: QueryResultRow) {
    return {
        id: row.user_gist_id,
        gist: {
            id: row.user_id,
            username: row.username,
        },
        isFavorite: row.is_favorite,
    };
}

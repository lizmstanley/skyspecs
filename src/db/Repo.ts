/*
 * Normally this would be an injectable component
 * We'd possibly use an ORM, or separate out the SQL queries so they're not
 * embedded in the code.
 * Using parameterized queries to prevent sql injection
 */
import { getDbConnection } from './DbConnectionProvider';
import { PoolClient, Query, QueryResult, QueryResultRow } from 'pg';
import { GithubGist } from '../gist/GistWrapper';
import { DbUserGist } from './DbModel';

export async function queryDbUserGist(gistId: string): Promise<DbUserGist | null> {
    const queryResult: DbUserGist[] = await queryDbGists('github_gist_id=$1', [gistId]);
    if (queryResult.length) {
        return queryResult[0];
    }
    return null;
}

export async function queryDbUserGists(username: string): Promise<DbUserGist[]> {
    return queryDbGists('username=$1', [username]);
}

export async function queryDbFavoriteGists(): Promise<DbUserGist[]> {
    return queryDbGists('is_favorite=true');
}

export async function insertDbUserGist(gist: GithubGist): Promise<boolean> {
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
            await dbConnection.query('insert into skyspecs_user_gist(github_gist_id, user_id) values($1,$2)', [
                gist.id,
                upsertResult.rows[0].id,
            ]);
        } else {
            await dbConnection.query(
                'insert into skyspecs_user_gist(github_gist_id,user_id) ' +
                    'select $1,su.id ' +
                    'from skyspecs_user su ' +
                    'where su.username=$2',
                [gist.id, gist.owner.login],
            );
        }
        await dbConnection.query('COMMIT');
        console.info(`Inserted db gist ${gist.id}`);
        return true;
    } catch (error) {
        await dbConnection.query('ROLLBACK');
    } finally {
        dbConnection.release();
    }
    return false;
}

export async function updateDbUserGist(githubId: string, isFavorite: boolean): Promise<void> {
    const dbConnection: PoolClient = await getDbConnection();
    try {
        await dbConnection.query('update skyspecs_user_gist set is_favorite=$1 where github_gist_id=$2', [
            isFavorite,
            githubId,
        ]);
        console.info(`Updated db gist ${githubId}`);
    } finally {
        dbConnection.release();
    }
}

async function queryDbGists(queryWhereCondition: string, args?: string[]): Promise<DbUserGist[]> {
    const dbConnection: PoolClient = await getDbConnection();
    try {
        const queryResult: QueryResult = await dbConnection.query(dbUserGistSelectSql(queryWhereCondition), args);
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

function dbUserGistSelectSql(whereCondition: string): string {
    return (
        'select skyspecs_user_gist.id as user_gist_id, skyspecs_user.id as user_id' +
        'github_gist_id, is_favorite, username ' +
        'from skyspecs_user_gist, skyspecs_user ' +
        `where ${whereCondition} ` +
        'and user_id=skyspecs_user.id'
    );
}

function mapRow(row: QueryResultRow): DbUserGist {
    return {
        githubGistId: row.github_gist_id,
        username: row.username,
        isFavorite: row.is_favorite,
    };
}

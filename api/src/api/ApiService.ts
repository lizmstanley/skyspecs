//Normally this would be an injectable component, the api layer would have any data layer components injected here, and
//services would be injected into controllers. The api layer calls the data layer, applies any business logic,
//and maps the database model to json. The data layer could be a database, or another rest api, etc.

import {ApiGist} from './ApiModel';
import {getGithubGistById, getGithubGistsForUser, GithubGist} from '../gist/GistWrapper';
import {DbUserGist} from '../db/DbModel';
import {insertDbUserGist, queryDbFavoriteGists, queryDbUserGist, updateDbUserGist,} from '../db/Repo';

/*
 * Query the Github public gists for the user, insert any we don't already have into our
 * database, then map to our api response
 */
export async function getApiGistsForUser(username: string): Promise<ApiGist[]> {
    const githubGists: GithubGist[] = await getGithubGistsForUser(username);
    if (!githubGists.length) {
        return [];
    }
    const apiGists: ApiGist[] = await Promise.all(
        githubGists.map(async (githubGist: GithubGist) =>
            mapApiGist(githubGist, await findOrInsertDbUserGist(githubGist)),
        ),
    );
    return apiGists;
}

export async function getApiGistById(gistId: string): Promise<ApiGist | null> {
    const githubGist: GithubGist = await getGithubGistById(gistId);
    if (!githubGist) {
        return null;
    }
    const dbUserGist: DbUserGist | null = await findOrInsertDbUserGist(githubGist);
    return mapApiGist(githubGist, dbUserGist);
}

export async function getApiGistFavorites(): Promise<ApiGist[]> {
    const favoriteGists: DbUserGist[] = await queryDbFavoriteGists();
    console.info(`Found ${favoriteGists.length} favorites`);
    if (!favoriteGists.length) {
        return [];
    }
    const apiGists: ApiGist[] = await Promise.all(
        favoriteGists.map(async (favoriteGist: DbUserGist) =>
            mapApiGist(await getGithubGistById(favoriteGist.githubGistId), favoriteGist),
        ),
    );
    return apiGists;
}

export async function setIsFavorite(gistId: string, isFavorite: boolean): Promise<void> {
     await updateDbUserGist(gistId, isFavorite);
}

async function findOrInsertDbUserGist(githubGist: GithubGist): Promise<DbUserGist | null> {
    const dbUserGist: DbUserGist | null = await queryDbUserGist(githubGist.id);
    if (dbUserGist) {
        return dbUserGist;
    }
    if (!dbUserGist) {
        await insertDbUserGist(githubGist);
    }
    return queryDbUserGist(githubGist.id);
}

function mapApiGist(githubGist: GithubGist, dbUserGist: DbUserGist | null): ApiGist {
    const githubMapped = {
        gistId: githubGist.id,
        username: githubGist.owner.login,
        description: githubGist.description,
        url: githubGist.url,
        dateCreated: githubGist.created_at,
        lastUpdated: githubGist.updated_at,
        files: Object.keys(githubGist.files),
        isFavorite: false,
    };
    if (!dbUserGist) {
        return githubMapped;
    }
    return {
        ...githubMapped,
        isFavorite: dbUserGist.isFavorite,
    };
}

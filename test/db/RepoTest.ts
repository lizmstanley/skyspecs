//This is an integration test, requires a db to be up and running
//Execute docker-compose up in the root of this projectk
//Normally I'd have a separate db for testing
import '../testenv';
import { insertDbUserGist, queryDbUserGist, queryDbUserGists, updateDbUserGist } from '../../src/db/Repo';
import { GithubGist } from '../../src/gist/GistWrapper';
import { assert } from 'chai';
import { DbUserGist } from '../../src/db/DbModel';
const { v4: uuidv4 } = require('uuid');

describe('RepoTest', () => {
    //normally I'd test functions separately, but in the interest of having data, doing it all in one test
    it('should execute repo functions', async () => {
        const username: string = 'testuser';
        const gistId: string = uuidv4();

        const insertResult: boolean = await insertDbUserGist(createGist(username, gistId));
        assert(insertResult);

        const queryUserGistsResult: DbUserGist[] = await queryDbUserGists(username);
        assert(queryUserGistsResult.length);

        let queryGistResult: DbUserGist | null = await queryDbUserGist(gistId);
        assert.isNotNull(queryGistResult);
        assert(!queryGistResult?.isFavorite);

        await updateDbUserGist(gistId, true);
        queryGistResult = await queryDbUserGist(gistId);
        assert.isNotNull(queryGistResult);
        assert(queryGistResult?.isFavorite);
    });
});

function createGist(username: string, gistId: string): GithubGist {
    return {
        url: 'https://api.github.com/gists/7813bdad0f086c62e0820c43dd4c8485',
        forks_url: 'https://api.github.com/gists/7813bdad0f086c62e0820c43dd4c8485/forks',
        commits_url: 'https://api.github.com/gists/7813bdad0f086c62e0820c43dd4c8485/commits',
        id: gistId,
        node_id: 'MDQ6R2lzdDc4MTNiZGFkMGYwODZjNjJlMDgyMGM0M2RkNGM4NDg1',
        git_pull_url: 'https://gist.github.com/7813bdad0f086c62e0820c43dd4c8485.git',
        git_push_url: 'https://gist.github.com/7813bdad0f086c62e0820c43dd4c8485.git',
        html_url: 'https://gist.github.com/7813bdad0f086c62e0820c43dd4c8485',
        files: {
            'anotherfile.ts': {
                filename: 'anotherfile.ts',
                type: 'video/MP2T',
                language: 'TypeScript',
                raw_url:
                    'https://gist.githubusercontent.com/lizmstanley/7813bdad0f086c62e0820c43dd4c8485/raw/fb716ef743b8d74d5778feb392595705ac331808/anotherfile.ts',
                size: 91,
            },
            'test.ts': {
                filename: 'test.ts',
                type: 'video/MP2T',
                language: 'TypeScript',
                raw_url:
                    'https://gist.githubusercontent.com/lizmstanley/7813bdad0f086c62e0820c43dd4c8485/raw/4bc0900680dc095d6e98b0079bbac6459bcfd337/test.ts',
                size: 85,
            },
        },
        public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: 'this is a test gist',
        comments: 0,
        user: null,
        comments_url: 'https://api.github.com/gists/7813bdad0f086c62e0820c43dd4c8485/comments',
        owner: {
            login: username,
            id: 26873177,
            node_id: 'MDQ6VXNlcjI2ODczMTc3',
            avatar_url: 'https://avatars.githubusercontent.com/u/26873177?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/lizmstanley',
            html_url: 'https://github.com/lizmstanley',
            followers_url: 'https://api.github.com/users/lizmstanley/followers',
            following_url: 'https://api.github.com/users/lizmstanley/following{/other_user}',
            gists_url: 'https://api.github.com/users/lizmstanley/gists{/gist_id}',
            starred_url: 'https://api.github.com/users/lizmstanley/starred{/owner}{/repo}',
            subscriptions_url: 'https://api.github.com/users/lizmstanley/subscriptions',
            organizations_url: 'https://api.github.com/users/lizmstanley/orgs',
            repos_url: 'https://api.github.com/users/lizmstanley/repos',
            events_url: 'https://api.github.com/users/lizmstanley/events{/privacy}',
            received_events_url: 'https://api.github.com/users/lizmstanley/received_events',
            type: 'User',
            site_admin: false,
        },
        truncated: false,
    };
}

import { getGithubGistById, getGithubGistsForUser, GithubGist } from '../../src/gist/GistWrapper';
import { assert } from 'chai';

//This does an actually http call, so is an integration test
describe('GistWrapperTest', () => {
    it('should return gists for user', async () => {
        const result: GithubGist[] = await getGithubGistsForUser('lizmstanley');
        assert.isNotNull(result);
        assert(result.length);
    });

    it('should return gist by id', async () => {
        const id: string = '7813bdad0f086c62e0820c43dd4c8485';
        const result: GithubGist = await getGithubGistById(id);
        assert.equal(result.id, id);
    });
});

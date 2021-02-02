import { getGistById, getGistsForUser, Gist } from '../../src/gist/GistWrapper';
import { assert } from 'chai';

describe('GistWrapperTest', () => {
    it('should return gists for user', async () => {
        const result: Gist[] = await getGistsForUser('lizmstanley');
        assert.isNotNull(result);
        assert(result.length);
    });

    it('should return gist by id', async () => {
        const id: string = '7813bdad0f086c62e0820c43dd4c8485';
        const result: Gist = await getGistById(id);
        assert.equal(result.id, id);
    });
});

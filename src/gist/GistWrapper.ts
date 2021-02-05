import { AxiosResponse } from 'axios';
import axios from 'axios';
const baseUrl: string = 'https://api.github.com';

export async function getGithubGistsForUser(username: string): Promise<GithubGist[]> {
    const githubGists: GithubGist[] = await sendGithubGistRequest(`users/${username}/gists`);
    console.info(`Found ${githubGists ? githubGists.length : 0} gists for user ${username}`);
    return githubGists;
}

export async function getGithubGistById(gistId: string): Promise<GithubGist> {
    const githubGist: GithubGist = await sendGithubGistRequest(`gists/${gistId}`);
    console.info(`Found ${!githubGist ? 'no' : 1} gist for gist id ${gistId}`);
    return githubGist;
}

async function sendGithubGistRequest(apiPath: string): Promise<any> {
    const requestUrl = `${baseUrl}/${apiPath}`;
    console.info(`Querying url: ${requestUrl}`);
    const options: any = {
        url: requestUrl,
        method: 'get',
        headers: {
            Accept: 'application/vnd.github.v3+json',
        },
        validateStatus: (status: number) => status < 400,
    };

    try {
        const response: AxiosResponse<GithubGist[]> = await axios(options);
        return response.data;
    } catch (error) {
        throw new Error(`error sending ${options.method} request ${requestUrl}: ${error.message}`);
    }
}

export interface GithubGist {
    url: string;
    forks_url: string;
    commits_url: string;
    id: string;
    node_id: string;
    git_pull_url: string;
    git_push_url: string;
    html_url: string;
    files: GistFiles;
    public: boolean;
    created_at: string;
    updated_at: string;
    description: string;
    comments: number;
    user: string | null;
    comments_url: string;
    owner: GistOwner;
    truncated: boolean;
}

export interface GistFiles {
    [key: string]: {
        filename: string;
        type: string;
        language: string;
        raw_url: string;
        size: number;
    };
}

export interface GistOwner {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}

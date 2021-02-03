export interface DbGist {
    id: number,
    username: string
}

export interface DbUserGist {
    id: number,
    gist: DbGist,
    isFavorite: boolean
}
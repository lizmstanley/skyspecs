export interface ApiGist {
    username: string;
    gistId: string;
    isFavorite: boolean;
    description: string;
    url: string;
    dateCreated: string;
    lastUpdated: string;
    files: string[];
}
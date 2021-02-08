import {ApolloClient, InMemoryCache} from '@apollo/client';

//calling localhost because this request is coming from the browser (external to the docker container)
const apiUrl = 'http://localhost:3001/api';

export const client = new ApolloClient({
    uri: apiUrl,
    cache: new InMemoryCache(),
});
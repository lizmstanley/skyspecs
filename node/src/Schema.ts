import { GraphQLBoolean, GraphQLList } from 'graphql';
import { getApiGistById, getApiGistFavorites, getApiGistsForUser, setIsFavorite } from './api/ApiService';

const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');

const gistType = new GraphQLObjectType({
    name: 'Gist',
    fields: {
        username: { type: GraphQLString },
        gistId: { type: GraphQLString },
        isFavorite: { type: GraphQLBoolean },
        description: { type: GraphQLString },
        url: { type: GraphQLString },
        dateCreated: { type: GraphQLString },
        lastUpdated: { type: GraphQLString },
        files: { type: GraphQLList(GraphQLString) },
    },
});

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        user: {
            type: GraphQLList(gistType),
            args: {
                username: { type: GraphQLString },
            },
            resolve: async (source: any, { username }: any) => getApiGistsForUser(username),
        },
        gist: {
            type: gistType,
            args: {
                id: { type: GraphQLString },
            },
            resolve: async (source: any, { id }: any) => getApiGistById(id),
        },
        favorites: {
            type: GraphQLList(gistType),
            args: {},
            resolve: async () => getApiGistFavorites(),
        },
    },
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        favorite: {
            type: gistType,
            args: {
                id: { type: GraphQLString },
                isFavorite: { type: GraphQLBoolean },
            },
            resolve: async (source: any, { id, isFavorite }: any) => {
                await setIsFavorite(id, isFavorite);
                return getApiGistById(id);
            },
        },
    },
});

export const rootSchema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
});

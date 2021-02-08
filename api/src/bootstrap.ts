import './env';
import { graphqlHTTP } from 'express-graphql';
import { rootSchema } from './Schema';

const express = require('express');
const cors = require('cors');

(() => {
    startServer();
})();

function startServer() {
    const server = express();
    server.use(cors());
    server.use(
        '/api',
        graphqlHTTP({
            schema: rootSchema,
            graphiql: true,
        }),
    );
    server.listen(3000);
}

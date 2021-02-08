import React from 'react';
import './App.css';
import {client} from './apollo-client';
import {ApolloProvider} from "@apollo/client";
import {FavoriteGists} from "./FavoriteGists";

function App() {
	return (
		<ApolloProvider client={client}>
			Use the <a href="http://localhost:3001/api" target="_blank">graphql api</a> to update favorites, and refresh the page to show favorite gists here.<p/>
			Execute a query for a username:
			<pre>{`
query {
  userGists(username: "username") {
    username
    description
    gistId
    isFavorite
    dateCreated
    files
  }
}
  		   `}</pre><p/>
			Mark a gistId as a favorite:
			<pre>{`
mutation {
  favorite(id: "gistId", isFavorite: true) {
    username
    description
    gistId
    isFavorite
    dateCreated
    files
  }
}
			`}</pre>
			<h3>Favorites</h3>
			<FavoriteGists />
		</ApolloProvider>
	);
}
export default App;

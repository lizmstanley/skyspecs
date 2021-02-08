# Sample project for SkySpecs

Note: I took the requirements to mean that the "favorite" flag should be stored in the database.

* This project consists of 3 docker containers: 
  * Postgress database, 
  * Node/Express backend 
  * Node/React frontend (using Node for simplicity's sake - in a real scenario I'd set up Nginx to host static
    content and reverse proxy api queries to the Node back end.)
* Requires docker and docker-compose.
* To start, at the root of the project, execute `docker-compose up`
* To stop, execute `docker-compose down`
* To rebuild both node containers, execute `rebuild_all.sh`

### React
* I have very little front end experience, and none with react. However I did make an extremely rudimentary page to illustrate
the connection to the back end, and to show that one query wwould work. See http://localhost:3000
  
### GraphQL API
* Graphql queries against the API can be run in a browser at http://localhost:3001/api
* Example queries (add argument values as needed):
```
  query {
     userGists(username: [username]) {
        username
        description
        gistId
        isFavorite
        dateCreated
        files
     }
  }
```
```
query {
  gist(id: [github gist id]) {
    username
    description
    gistId
    isFavorite
    dateCreated
    files
  }
}
```
```
query {
  favoriteGists {
    username
    description
    gistId
    isFavorite
    dateCreated
    files
  }
}
```
```
mutation{
  favorite(id: [github gist id], isFavorite: [true/false]) {
    username
    description
    gistId
    isFavorite
    dateCreated
    files
  }
}
```

### Database
* Open a database client using:
  * localhost/5432
  * user: skyspecs_user
  * password: skyspecs_pass
  * under the public schema, see tables skyspecs_user and skyspecs_user_gist
  

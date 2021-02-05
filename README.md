# Sample project

* Requires docker and docker-compose.
* To start, at the root of the project, execute `docker-compose up`
* To stop, execute `docker-compose down`
* In a browser, open http://localhost:3000/api
* Example queries (add argument values as needed):
```
  query {
     user(username: [username]) {
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
  favorites {
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
* Open a database client using:
  * localhost/5432
  * user: skyspecs_user
  * password: skyspecs_pass
  * under the public schema, see tables skyspecs_user and skyspecs_user_gist
  

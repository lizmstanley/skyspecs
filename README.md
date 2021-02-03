# Sample project

###

* Requires docker and docker-compose. 
* To start, at the root of the project, execute `docker-compose up`
* To stop, execute `docker-compose down`
* My preference would be to use NestJS and dependency injection, however that is overkill and too
  time consuming for this project.
* The typical design would be 3 layers: controllers (for endpoints), services (for business logic), 
  repos (data access).

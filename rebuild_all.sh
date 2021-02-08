#Note: this deletes all the db data
docker-compose down
sudo rm -rf data
docker image ls 'skyspecs_api-service' -q | xargs docker rmi
docker image ls 'skyspecs_ui-service' -q | xargs docker rmi
docker-compose up

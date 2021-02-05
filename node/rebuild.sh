#Note: this deletes all the data
docker-compose down
sudo rm -rf data
docker image ls 'skyspecs_node-service' -q | xargs docker rmi
docker-compose up

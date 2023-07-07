# Chat app - Backend 

The backend has the following stack:
* nodejs, with javascript (no typescript right now)
* express server
* mongodb database (MongoDb atlas cloud)
* socket.io sockets
* cdk to build 

## Running locally

To run locally:
* run mongodb 
  * either locally, using docker
  * or using a cloud provider like MongoDb Atlas
* configure env variables 
* run `npm run dev`

### Running user docker

> Running locally using docker is not worth it because it requires two different containers (backend server and database) to communicate with each other, which takes some work to setup in docker

In any case, to build docker and run locally
```bash
docker build -t chat-app-backend .
docker run -p 5001:5001 --env-file .env.dev chat-app-backend
```

Note: this will currently fail if trying to reach mongodb running inside a container, although it will still work if you point at a database exposed via the internet.


## Running in production

For production, we have:
* cdk to build and manage cloud infrastructure
* ECS Fargate running containers
* MongoDb cloud atlas
   

## Env variables

* env variables have to be manually added to the [backend deployment script](../.github/workflows/deploy_backend.yml)


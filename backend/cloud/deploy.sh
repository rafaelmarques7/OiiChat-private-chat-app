#!/bin/bash

# Variables
REGION="eu-west-1"                      # Your AWS region
REPO_NAME="chat-app-backend"            # Your ECR repository name
TASK_NAME="chat-app-backend-task"       # Your task definition name
SERVICE_NAME="chat-app-backend-service" # Your service name
CLUSTER_NAME="chat-app-backend-cluster" # Your cluster name
IMAGE_TAG="latest"                      # Your image tag

# Build docker image
cd ..
docker build -t $REPO_NAME:$IMAGE_TAG .

# Login to AWS ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin 381336380362.dkr.ecr.$REGION.amazonaws.com

# Tag docker image
docker tag $REPO_NAME:$IMAGE_TAG 381336380362.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:$IMAGE_TAG

# Push docker image
docker push 381336380362.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:$IMAGE_TAG

# Register a new ECS task definition
cd ./cloud
echo "Registering ECS task definition..."
ls -lha
TASK_REVISION=$(aws ecs register-task-definition --family $TASK_NAME --container-definitions file://task-definition.json --requires-compatibilities FARGATE --network-mode awsvpc --region $REGION | jq --raw-output '.taskDefinition.revision')

# Update the ECS service with the new task definition and desired count
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --desired-count 1 --task-definition $TASK_NAME:$TASK_REVISION --region $REGION

echo "Deployment complete."

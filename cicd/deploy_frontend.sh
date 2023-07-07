#!/bin/bash

LOCAL_FOLDER_PATH="build"
S3_BUCKET_NAME="my-private-chat-app"

# Change to the frontend directory which should contain the /build folder
cd ../frontend

aws s3 sync "$LOCAL_FOLDER_PATH" "s3://$S3_BUCKET_NAME"

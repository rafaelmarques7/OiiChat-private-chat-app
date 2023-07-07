#!/bin/bash

S3_BUCKET_NAME="your-bucket-name"
LOCAL_FOLDER_PATH="/path/to/local/folder"

# Upload files to S3 bucket
aws s3 sync "$LOCAL_FOLDER_PATH" "s3://$S3_BUCKET_NAME"

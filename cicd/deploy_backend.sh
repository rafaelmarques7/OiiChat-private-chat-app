#!/bin/bash

# Chnage to the backend directory
cd ../backend

cdk deploy --require-approval never

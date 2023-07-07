#!/usr/bin/env node

const cdk = require("aws-cdk-lib");
const { ChatAppCdkStack } = require("./cdk-stack");

const app = new cdk.App();
new ChatAppCdkStack(app, "ChatAppCdkStack", {});

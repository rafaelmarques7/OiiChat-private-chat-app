const cdk = require("aws-cdk-lib");
const iam = cdk.aws_iam;
const ec2 = cdk.aws_ec2;
const ecs = cdk.aws_ecs;
const logs = cdk.aws_logs;
const ecs_patterns = cdk.aws_ecs_patterns;
const ecr_assets = cdk.aws_ecr_assets;

class ChatAppCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Define the ECR Asset
    const dockerImageAsset = new ecr_assets.DockerImageAsset(
      this,
      "MyDockerImageAsset",
      {
        directory: "./",
      }
    );

    // Create a new VPC
    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 3, // Default is all AZs in the region
    });

    // Create a new ECS cluster
    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc: vpc,
    });

    // Create Fargate Service with a load balancer
    const fargateService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "FargateService",
        {
          cluster: cluster, // Required
          cpu: 256, // Default is 256
          desiredCount: 1, // Default is 1
          taskImageOptions: {
            image: ecs.ContainerImage.fromRegistry(dockerImageAsset.imageUri),
            containerPort: 5001,
            logDriver: new ecs.AwsLogDriver({
              streamPrefix: "MyApp",
              logGroup: new logs.LogGroup(this, "LogGroup", {
                logGroupName: "/ecs/MyApp",
                retention: logs.RetentionDays.ONE_WEEK,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
              }),
            }),
          },
          memoryLimitMiB: 512, // Default is 512
          publicLoadBalancer: true, // Default is false
        }
      );

    fargateService.taskDefinition.executionRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
        ],
        resources: ["*"],
      })
    );

    // Access the ECS service associated with the ApplicationLoadBalancedFargateService
    const ecsService = fargateService.service;

    // Configure health checks for the ECS service
    ecsService.taskDefinition.defaultContainer?.addHealthCheck({
      command: [
        "CMD-SHELL",
        "curl -f http://localhost:5001/messages || exit 1",
      ],
      interval: cdk.Duration.seconds(30),
      timeout: cdk.Duration.seconds(5),
      retries: 3,
    });

    // Output the DNS where you can access your service
    new cdk.CfnOutput(this, "LoadBalancerDNS", {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
  }
}

module.exports = { ChatAppCdkStack };

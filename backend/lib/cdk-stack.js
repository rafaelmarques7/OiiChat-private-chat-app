const cdk = require("aws-cdk-lib");
const iam = cdk.aws_iam;
const ec2 = cdk.aws_ec2;
const ecs = cdk.aws_ecs;
const ecs_patterns = cdk.aws_ecs_patterns;
const ecr_assets = cdk.aws_ecr_assets;

class MyEcsAppStack extends cdk.Stack {
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
            executionRole: iam.Role.fromRoleArn(
              this,
              "ExecutionRole",
              "arn:aws:iam::381336380362:role/MyEcsAppStack-FargateServiceTaskDefExecutionRole91-1N1BUYEMM2YYQ"
            ),
          },
          memoryLimitMiB: 512, // Default is 512
          publicLoadBalancer: true, // Default is false
        }
      );

    fargateService.taskDefinition.executionRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["ecr:GetAuthorizationToken"],
        resources: ["*"],
      })
    );

    // Output the DNS where you can access your service
    new cdk.CfnOutput(this, "LoadBalancerDNS", {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
  }
}

module.exports = { MyEcsAppStack };

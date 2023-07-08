const cdk = require("aws-cdk-lib");
const iam = cdk.aws_iam;
const ec2 = cdk.aws_ec2;
const ecs = cdk.aws_ecs;
const logs = cdk.aws_logs;
const ecs_patterns = cdk.aws_ecs_patterns;
const ecr_assets = cdk.aws_ecr_assets;
const elbv2 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const acm = require("aws-cdk-lib/aws-certificatemanager");

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

    // Create an ALB
    const alb = new elbv2.ApplicationLoadBalancer(this, "ALB", {
      vpc,
      internetFacing: true,
    });

    const targetGroup = new elbv2.ApplicationTargetGroup(this, "TargetGroup", {
      vpc,
      targetType: elbv2.TargetType.IP,
      port: 80, // Adjust the port as needed
      protocol: elbv2.ApplicationProtocol.HTTP,
    });

    const cert = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      "arn:aws:acm:eu-west-1:381336380362:certificate/6f944b07-a30e-439c-8da2-54890a644ec4"
    );

    const listener = alb.addListener("Listener", {
      port: 443,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [cert],
      defaultTargetGroups: [targetGroup],
    });

    // Create Fargate Service with a load balancer
    const fargateService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "FargateService",
        {
          cluster: cluster, // Required
          targetGroup: targetGroup,
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
            environment: {
              URL_DATABASE: process.env.URL_DATABASE,
              URL_FRONTEND: process.env.URL_FRONTEND,
            },
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

    // Output the DNS where you can access your service
    new cdk.CfnOutput(this, "LoadBalancerDNS", {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
  }
}

module.exports = { ChatAppCdkStack };

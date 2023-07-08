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
          },
          memoryLimitMiB: 512, // Default is 512
          publicLoadBalancer: true, // Default is false
          protocol: elbv2.ApplicationProtocol.HTTPS, // Use HTTPS for the listener
          certificate: acm.Certificate.fromCertificateArn(
            this,
            "Certificate",
            "arn:aws:acm:eu-west-1:381336380362:certificate/6f944b07-a30e-439c-8da2-54890a644ec4"
          ),
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

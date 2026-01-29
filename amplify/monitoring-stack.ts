// Automated Cost Monitoring and OpenSearch Serverless Setup
// This file creates all monitoring infrastructure automatically

import { Stack, Duration, CfnOutput } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as opensearchserverless from 'aws-cdk-lib/aws-opensearchserverless';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ses from 'aws-cdk-lib/aws-ses';
import { Construct } from 'constructs';

interface MonitoringStackProps {
   env: 'dev' | 'prod';
   region: string;
   alertEmail: string;
   costThreshold: number;
   emailOptOutHandlerArn: string;
}

export class MonitoringStack extends Stack
{
   public readonly opensearchCollectionEndpoint: string;
   public readonly opensearchCollectionArn: string;

   constructor(scope: Construct, id: string, props: MonitoringStackProps)
   {
      super(scope, id);

      // SNS Topic for Cost Alerts
      const alertTopic = new sns.Topic(this, 'CostAlertTopic', {
         displayName: `Hukdzen ${props.env} Cost Alerts`,
         topicName: `hukdzen-${props.env}-cost-alerts`,
      });

      alertTopic.addSubscription(
         new subscriptions.EmailSubscription(props.alertEmail)
      );

      // SES Bounce/Complaint SNS Topics
      const bounceTopic = new sns.Topic(this, 'SESBounceTopic', {
         displayName: `Hukdzen ${props.env} SES Bounces`,
         topicName: `ses-bounces-${props.env}`,
      });

      const complaintTopic = new sns.Topic(this, 'SESComplaintTopic', {
         displayName: `Hukdzen ${props.env} SES Complaints`,
         topicName: `ses-complaints-${props.env}`,
      });

      // Subscribe emailOptOutHandler Lambda to bounce/complaint topics
      const emailOptOutHandler = lambda.Function.fromFunctionArn(
         this, 'EmailOptOutHandler', props.emailOptOutHandlerArn
      );

      bounceTopic.addSubscription(
         new subscriptions.LambdaSubscription(emailOptOutHandler)
      );
      complaintTopic.addSubscription(
         new subscriptions.LambdaSubscription(emailOptOutHandler)
      );

      // SES Configuration Set (always in us-west-2)
      const configSet = new ses.ConfigurationSet(this, 'SESConfigSet',
      { configurationSetName: `hukdzen-${props.env}`, });

      configSet.addEventDestination('BounceDestination', {
         destination: ses.EventDestination.snsTopic(bounceTopic),
         events: [ses.EmailSendingEvent.BOUNCE],
      });

      configSet.addEventDestination('ComplaintDestination', {
         destination: ses.EventDestination.snsTopic(complaintTopic),
         events: [ses.EmailSendingEvent.COMPLAINT],
      });

      // OpenSearch Serverless Collection
      const collection = new opensearchserverless.CfnCollection(this, 'SearchCollection', {
         name: `hukdzen-${props.env}`, type: 'SEARCH',
         description: `Hukdzen ${props.env} search collection`,
      });

      // OpenSearch Serverless Encryption Policy
      const encryptionPolicy = new opensearchserverless.CfnSecurityPolicy(
         this, 'EncryptionPolicy',
         {
            name: `hukdzen-${props.env}-encryption`, type: 'encryption',
            policy: JSON.stringify({
               Rules: [
                  {
                     ResourceType: 'collection',
                     Resource: [`collection/hukdzen-${props.env}`],
                  },
               ],
               AWSOwnedKey: true,
            }),
         }
      );

      // OpenSearch Serverless Network Policy
      const networkPolicy = new opensearchserverless.CfnSecurityPolicy(
         this, 'NetworkPolicy',
         {
            name: `hukdzen-${props.env}-network`,
            type: 'network',
            policy: JSON.stringify([
               {
                  Rules: [
                     {
                        ResourceType: 'collection',
                        Resource: [`collection/hukdzen-${props.env}`],
                     },
                  ],
                  AllowFromPublic: false,
                  SourceVPCEs: [],
               },
            ]),
         }
      );

      collection.addDependency(encryptionPolicy);
      collection.addDependency(networkPolicy);

      this.opensearchCollectionEndpoint = collection.attrCollectionEndpoint;
      this.opensearchCollectionArn = collection.attrArn;

      // Create Cognito WebAppAdmin group automatically
      const userPool = cognito.UserPool.fromUserPoolId(this, 'UserPool',
         process.env.USER_POOL_ID || 'PLACEHOLDER'
      );

      new cognito.CfnUserPoolGroup(this, 'WebAppAdminGroup', {
         userPoolId: userPool.userPoolId,
         groupName: 'WebAppAdmin', description: 'Web Application Administrators',
         precedence: 1,
      });

      // Cost Alarm: Total Monthly Cost
      new cloudwatch.Alarm(this, 'TotalCostAlarm', {
         alarmName: `hukdzen-${props.env}-total-cost`,
         alarmDescription: `Alert when ${props.env} monthly cost exceeds $${props.costThreshold}`,
         metric: new cloudwatch.Metric({
            namespace: 'AWS/Billing', metricName: 'EstimatedCharges',
            statistic: 'Maximum', period: Duration.hours(6),
            dimensionsMap: { Currency: 'USD', },
         }),
         threshold: props.costThreshold,
         evaluationPeriods: 1,
         comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
         actionsEnabled: true,
      })
      .addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }), });

      // Cost Alarm: Lambda Invocations (runaway detection)
      new cloudwatch.Alarm(this, 'LambdaInvocationsAlarm', {
         alarmName: `hukdzen-${props.env}-lambda-invocations`,
         alarmDescription: 'Alert on excessive Lambda invocations',
         metric: new cloudwatch.Metric({
            namespace: 'AWS/Lambda', metricName: 'Invocations',
            statistic: 'Sum', period: Duration.hours(1),
         }),
         threshold: props.env === 'prod' ? 1000 : 500,
         evaluationPeriods: 2,
         comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
         actionsEnabled: true,
      })
      .addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }), });

      // Cost Alarm: DynamoDB Throttling
      new cloudwatch.Alarm(this, 'DynamoDBThrottleAlarm', {
         alarmName: `hukdzen-${props.env}-dynamodb-throttle`,
         alarmDescription: 'Alert on DynamoDB throttling',
         metric: new cloudwatch.Metric({
            namespace: 'AWS/DynamoDB', metricName: 'UserErrors',
            statistic: 'Sum', period: Duration.minutes(5),
         }),
         threshold: 10,
         evaluationPeriods: 2,
         comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
         actionsEnabled: true,
      })
      .addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }), });

      // Cost Alarm: S3 Storage Growth
      new cloudwatch.Alarm(this, 'S3StorageAlarm', {
         alarmName: `hukdzen-${props.env}-s3-storage`,
         alarmDescription: 'Alert on unexpected S3 storage growth',
         metric: new cloudwatch.Metric({
            namespace: 'AWS/S3',  metricName: 'BucketSizeBytes',
            statistic: 'Average', period: Duration.days(1),
         }),
         threshold: 10 * 1024 * 1024 * 1024,
         evaluationPeriods: 1,
         comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
         actionsEnabled: true,
      })
      .addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }), });

      // SES Bounce Rate Alarm
      new cloudwatch.Alarm(this, 'SESBounceRateAlarm', {
         alarmName: `hukdzen-${props.env}-ses-bounce-rate`,
         alarmDescription: 'Alert when SES bounce rate exceeds 5%',
         metric: new cloudwatch.Metric({
            namespace: 'AWS/SES', metricName: 'Reputation.BounceRate',
            statistic: 'Average', period: Duration.minutes(5),
         }),
         threshold: 0.05,
         evaluationPeriods: 1,
         comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
         treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
         actionsEnabled: true,
      })
      .addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }), });

      // SES Complaint Rate Alarm
      new cloudwatch.Alarm(this, 'SESComplaintRateAlarm', {
         alarmName: `hukdzen-${props.env}-ses-complaint-rate`,
         alarmDescription: 'Alert when SES complaint rate exceeds 0.1%',
         metric: new cloudwatch.Metric({
            namespace: 'AWS/SES', metricName: 'Reputation.ComplaintRate',
            statistic: 'Average', period: Duration.minutes(5),
         }),
         threshold: 0.001,
         evaluationPeriods: 1,
         comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
         treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
         actionsEnabled: true,
      })
      .addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }), });

      // CloudWatch Dashboard
      const dashboard = new cloudwatch.Dashboard(this, 'CostDashboard',
      { dashboardName: `hukdzen-${props.env}-costs`, });

      dashboard.addWidgets(
         new cloudwatch.GraphWidget({
            title: 'Estimated Monthly Cost',
            left: [
               new cloudwatch.Metric({
                  namespace: 'AWS/Billing', metricName: 'EstimatedCharges',
                  statistic: 'Maximum', period: Duration.hours(6),
                  dimensionsMap: { Currency: 'USD' },
               }),
            ],
         }),
         new cloudwatch.GraphWidget({
            title: 'Lambda Invocations',
            left: [
               new cloudwatch.Metric({
                  namespace: 'AWS/Lambda', metricName: 'Invocations',
                  statistic: 'Sum', period: Duration.hours(1),
               }),
            ],
         }),
         new cloudwatch.GraphWidget({
            title: 'DynamoDB Operations',
            left: [
               new cloudwatch.Metric({
                  namespace: 'AWS/DynamoDB', metricName: 'ConsumedReadCapacityUnits',
                  statistic: 'Sum', period: Duration.minutes(5),
               }),
               new cloudwatch.Metric({
                  namespace: 'AWS/DynamoDB', metricName: 'ConsumedWriteCapacityUnits',
                  statistic: 'Sum', period: Duration.minutes(5),
               }),
            ],
         })
      );

      // Outputs
      new CfnOutput(this, 'OpenSearchEndpoint', {
         value: this.opensearchCollectionEndpoint,
         description: 'OpenSearch Serverless Collection Endpoint',
         exportName: `hukdzen-${props.env}-opensearch-endpoint`,
      });

      new CfnOutput(this, 'AlertTopicArn', {
         value: alertTopic.topicArn,
         description: 'SNS Topic for Cost Alerts',
         exportName: `hukdzen-${props.env}-alert-topic`,
      });

      new CfnOutput(this, 'SESConfigSetName', {
         value: configSet.configurationSetName,
         description: 'SES Configuration Set Name',
         exportName: `hukdzen-${props.env}-ses-config-set`,
      });

      new CfnOutput(this, 'DashboardUrl',
      {
         value: `https://console.aws.amazon.com/cloudwatch/home?region=${props.region}#dashboards:name=${dashboard.dashboardName}`,
         description: 'CloudWatch Dashboard URL',
      });
   }
}

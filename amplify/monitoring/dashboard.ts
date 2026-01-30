import { Stack, Duration, CfnOutput } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

interface DashboardProps
{
   env: 'dev' | 'prod';
   region: string;
   stack: Stack;
   collectionName: string;
}

export function createDashboard(props: DashboardProps)
{
   const { env, region, stack, collectionName } = props;

   const dashboard = new cloudwatch.Dashboard(stack, 'CostDashboard',
   { dashboardName: `hukdzen-${env}-costs`, });

   dashboard.addWidgets(
      new cloudwatch.GraphWidget({
         title: 'Estimated Monthly Cost',
         left: [
            new cloudwatch.Metric({
               namespace: 'AWS/Billing',
               metricName: 'EstimatedCharges',
               statistic: 'Maximum',
               period: Duration.hours(6),
               dimensionsMap: { Currency: 'USD' },
            }),
         ],
      }),
      new cloudwatch.GraphWidget({
         title: 'Lambda Invocations',
         left: [
            new cloudwatch.Metric({
               namespace: 'AWS/Lambda',
               metricName: 'Invocations',
               statistic: 'Sum',
               period: Duration.hours(1),
            }),
         ],
      }),
      new cloudwatch.GraphWidget({
         title: 'DynamoDB Operations',
         left: [
            new cloudwatch.Metric({
               namespace: 'AWS/DynamoDB',
               metricName: 'ConsumedReadCapacityUnits',
               statistic: 'Sum',
               period: Duration.minutes(5),
            }),
            new cloudwatch.Metric({
               namespace: 'AWS/DynamoDB',
               metricName: 'ConsumedWriteCapacityUnits',
               statistic: 'Sum',
               period: Duration.minutes(5),
            }),
         ],
      }),
      new cloudwatch.GraphWidget({
         title: 'OpenSearch OCU Usage',
         left: [
            new cloudwatch.Metric({
               namespace: 'AWS/AOSS',
               metricName: 'SearchOCU',
               statistic: 'Average',
               period: Duration.hours(1),
               dimensionsMap: {
                  CollectionName: collectionName,
                  ClientId: stack.account,
               },
            }),
            new cloudwatch.Metric({
               namespace: 'AWS/AOSS',
               metricName: 'IndexingOCU',
               statistic: 'Average',
               period: Duration.hours(1),
               dimensionsMap: {
                  CollectionName: collectionName,
                  ClientId: stack.account,
               },
            }),
         ],
      }),
      new cloudwatch.GraphWidget({
         title: 'OpenSearch Operations',
         left: [
            new cloudwatch.Metric({
               namespace: 'AWS/AOSS',
               metricName: 'SearchRate',
               statistic: 'Sum',
               period: Duration.minutes(5),
               dimensionsMap: {
                  CollectionName: collectionName,
                  ClientId: stack.account,
               },
            }),
            new cloudwatch.Metric({
               namespace: 'AWS/AOSS',
               metricName: 'IndexingRate',
               statistic: 'Sum',
               period: Duration.minutes(5),
               dimensionsMap: {
                  CollectionName: collectionName,
                  ClientId: stack.account,
               },
            }),
         ],
      })
   );

   new CfnOutput(stack, 'DashboardUrl',
   {
      value: `https://console.aws.amazon.com/cloudwatch/home?region=${region}#dashboards:name=${dashboard.dashboardName}`,
      description: 'CloudWatch Dashboard URL',
   });
}

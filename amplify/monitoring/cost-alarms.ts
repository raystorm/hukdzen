import { Stack, Duration, CfnOutput } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

interface CostMonitoringProps
{
   env: 'dev' | 'prod';
   region: string;
   stack: Stack;
   alertEmail: string;
   costThreshold: number;
}

export function createCostMonitoring(props: CostMonitoringProps)
{
   const { env, region, stack, alertEmail, costThreshold } = props;

   const alertTopic = new sns.Topic(stack, 'CostAlertTopic',
   {
      displayName: `Hukdzen ${env} Cost Alerts`,
      topicName: `hukdzen-${env}-cost-alerts`,
   });

   alertTopic.addSubscription(new subscriptions.EmailSubscription(alertEmail));

   new cloudwatch.Alarm(stack, 'TotalCostAlarm',
   {
      alarmName: `hukdzen-${env}-total-cost`,
      alarmDescription: `Alert when ${env} monthly cost exceeds $${costThreshold}`,
      metric: new cloudwatch.Metric({
         namespace: 'AWS/Billing',
         metricName: 'EstimatedCharges',
         statistic: 'Maximum',
         period: Duration.hours(6),
         dimensionsMap: { Currency: 'USD' },
      }),
      threshold: costThreshold, // $18 (dev), $35 (prod)
      evaluationPeriods: 1, // Alert immediately
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      actionsEnabled: true,
   })
   .addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }), });

   new cloudwatch.Alarm(stack, 'LambdaInvocationsAlarm',
   {
      alarmName: `hukdzen-${env}-lambda-invocations`,
      alarmDescription: 'Alert on excessive Lambda invocations',
      metric: new cloudwatch.Metric({
         namespace: 'AWS/Lambda',
         metricName: 'Invocations',
         statistic: 'Sum',
         period: Duration.hours(1),
      }),
      threshold: env === 'prod' ? 200 : 100, // 100/hour (dev), 200/hour (prod)
      evaluationPeriods: 2, // Alert after 2 consecutive hours
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      actionsEnabled: true,
   })
   .addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }), });

   new cloudwatch.Alarm(stack, 'DynamoDBThrottleAlarm',
   {
      alarmName: `hukdzen-${env}-dynamodb-throttle`,
      alarmDescription: 'Alert on DynamoDB throttling',
      metric: new cloudwatch.Metric({
         namespace: 'AWS/DynamoDB',
         metricName: 'UserErrors',
         statistic: 'Sum',
         period: Duration.minutes(5),
      }),
      threshold: 10, // 10 throttle errors
      evaluationPeriods: 2, // Alert after 2 consecutive 5-min periods (10 min total)
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      actionsEnabled: true,
   })
   .addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }), });

   new CfnOutput(stack, 'AlertTopicArn',
   {
      value: alertTopic.topicArn,
      description: 'SNS Topic for Cost Alerts',
      exportName: `hukdzen-${env}-alert-topic`,
   });

   return { alertTopic };
}

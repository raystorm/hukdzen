import { Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Stack } from 'aws-cdk-lib';

interface SearchMonitoringProps
{
   env: 'dev' | 'prod';
   stack: Stack;
   collectionName: string;
   alertTopic: sns.Topic;
}

export function createSearchMonitoring(props: SearchMonitoringProps)
{
   const { env, stack, collectionName, alertTopic } = props;

   new cloudwatch.Alarm(stack, 'OpenSearchSearchLatency',
   {
      alarmName: `hukdzen-${env}-opensearch-search-latency`,
      alarmDescription: 'Alert when search latency exceeds 2 seconds',
      metric: new cloudwatch.Metric({
         namespace: 'AWS/AOSS',
         metricName: 'SearchLatency',
         statistic: 'Average',
         period: Duration.minutes(5),
         dimensionsMap: {
            CollectionName: collectionName,
            ClientId: stack.account,
         },
      }),
      threshold: 2000, // 2 seconds (in milliseconds)
      evaluationPeriods: 2, // Alert after 2 consecutive 5-min periods (10 min total)
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      actionsEnabled: true,
   })
   .addAlarmAction(new SnsAction(alertTopic));

   new cloudwatch.Alarm(stack, 'OpenSearchOCUUsage',
   {
      alarmName: `hukdzen-${env}-opensearch-ocu-usage`,
      alarmDescription: 'Alert when OCU usage is unexpectedly high',
      metric: new cloudwatch.Metric({
         namespace: 'AWS/AOSS',
         metricName: 'SearchOCU',
         statistic: 'Maximum',
         period: Duration.hours(1),
         dimensionsMap: {
            CollectionName: collectionName,
            ClientId: stack.account,
         },
      }),
      threshold: env === 'prod' ? 1.5 : 1, // 1 OCU (dev), 1.5 OCU (prod) - min is 0.5
      evaluationPeriods: 2, // Alert after 2 consecutive 1-hour periods (2 hours total)
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      actionsEnabled: true,
   })
   .addAlarmAction(new SnsAction(alertTopic));
}

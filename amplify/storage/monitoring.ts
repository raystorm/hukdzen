import { Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Stack } from 'aws-cdk-lib';

interface StorageMonitoringProps
{
   env: 'dev' | 'prod';
   stack: Stack;
   alertTopic: sns.Topic;
}

export function createStorageMonitoring(props: StorageMonitoringProps)
{
   const { env, stack, alertTopic } = props;

   new cloudwatch.Alarm(stack, 'S3StorageAlarm',
   {
      alarmName: `hukdzen-${env}-s3-storage`,
      alarmDescription: 'Alert on unexpected S3 storage growth',
      metric: new cloudwatch.Metric({
         namespace: 'AWS/S3',
         metricName: 'BucketSizeBytes',
         statistic: 'Average',
         period: Duration.days(1),
      }),
      threshold: 1 * 1024 * 1024 * 1024, // 1 GB (current: 120 MB dev, 35 MB prod)
      evaluationPeriods: 1, // Alert immediately (checked daily)
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      actionsEnabled: true,
   })
   .addAlarmAction(new SnsAction(alertTopic));
}

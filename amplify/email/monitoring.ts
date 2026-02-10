import { Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Stack } from 'aws-cdk-lib';

interface EmailMonitoringProps
{
   env: 'dev' | 'prod';
   stack: Stack;
   alertTopic: sns.Topic;
}

export function createEmailMonitoring(props: EmailMonitoringProps)
{
   const { env, stack, alertTopic } = props;

   new cloudwatch.Alarm(stack, 'SESBounceRateAlarm',
   {
      alarmName: `hukdzen-${env}-ses-bounce-rate`,
      alarmDescription: 'Alert when SES bounce rate exceeds 5%',
      metric: new cloudwatch.Metric({
         namespace: 'AWS/SES',
         metricName: 'Reputation.BounceRate',
         statistic: 'Average',
         period: Duration.minutes(5),
      }),
      threshold: 0.05, // 5% bounce rate (AWS suspends at 10%)
      evaluationPeriods: 1, // Alert immediately
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      actionsEnabled: true,
   })
   .addAlarmAction(new SnsAction(alertTopic));

   new cloudwatch.Alarm(stack, 'SESComplaintRateAlarm',
   {
      alarmName: `hukdzen-${env}-ses-complaint-rate`,
      alarmDescription: 'Alert when SES complaint rate exceeds 0.1%',
      metric: new cloudwatch.Metric({
         namespace: 'AWS/SES',
         metricName: 'Reputation.ComplaintRate',
         statistic: 'Average',
         period: Duration.minutes(5),
      }),
      threshold: 0.001, // 0.1% complaint rate (AWS suspends at 0.5%)
      evaluationPeriods: 1, // Alert immediately
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      actionsEnabled: true,
   })
   .addAlarmAction(new SnsAction(alertTopic));
}

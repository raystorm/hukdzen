import { Stack, Duration } from 'aws-cdk-lib';
import { Alarm, ComparisonOperator, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

export function setupEmailNotifierMonitoring(stack: Stack,
                                             lambdaFunction: IFunction,
                                             alarmTopic: Topic)
{
   new Alarm(stack, 'EmailNotifierErrorAlarm', {
      metric: lambdaFunction.metricErrors({ period: Duration.minutes(5), }),
      threshold: 1,         // Alarm if >= 1 error
      evaluationPeriods: 1, // Alarm immediately (1 period)
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
      alarmDescription: 'Email notifier Lambda function errors',
      alarmName: `${stack.stackName}-EmailNotifier-Errors`,
   }).addAlarmAction(new SnsAction(alarmTopic));

   new Alarm(stack, 'EmailNotifierThrottleAlarm', {
      metric: lambdaFunction.metricThrottles({ period: Duration.minutes(5), }),
      threshold: 1,         // Alarm if >= 1 throttle
      evaluationPeriods: 1, // Alarm immediately (1 period)
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
      alarmDescription: 'Email notifier Lambda function throttles',
      alarmName: `${stack.stackName}-EmailNotifier-Throttles`,
   }).addAlarmAction(new SnsAction(alarmTopic));
}

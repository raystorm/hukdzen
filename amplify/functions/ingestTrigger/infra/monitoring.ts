import { Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';

interface LambdaMonitoringProps
{
   env: 'dev' | 'prod';
   lambdaFunction: lambda.IFunction;
   alertTopic: sns.Topic;
}

export function createLambdaMonitoring(props: LambdaMonitoringProps)
{
   const { env, lambdaFunction, alertTopic } = props;

   new cloudwatch.Alarm(lambdaFunction.stack, 'IngestTriggerErrors',
   {
      alarmName: `hukdzen-${env}-ingestTriggerErrors`,
      alarmDescription: 'Alert when ingestTrigger Lambda fails',
      metric: lambdaFunction.metricErrors({
         statistic: 'Sum',
         period: Duration.minutes(5),
      }),
      threshold: 1, // Alert on any Lambda error
      evaluationPeriods: 1, // Alert immediately on first error
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      actionsEnabled: true,
   })
   .addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }), });
}

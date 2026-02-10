import { Alarm, ComparisonOperator, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

export function createSearchRunnerMonitoring(
   scope: Construct,
   searchRunnerFunction: IFunction,
   alarmTopic: ITopic,
   env: 'dev' | 'prod'
): Alarm[]
{
   const errorAlarm = new Alarm(scope, 'SearchRunnerErrorAlarm',
   {
      alarmName: `hukdzen-${env}-searchRunnerErrors`,
      alarmDescription: 'Alert on search Lambda execution failures',
      metric: searchRunnerFunction.metricErrors(),
      threshold: 1,         // Alarm if >= 1 error occurs
      evaluationPeriods: 1, // Check 1 period (5 minutes by default)
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
   });
   errorAlarm.addAlarmAction(new SnsAction(alarmTopic));

   return [errorAlarm];
}

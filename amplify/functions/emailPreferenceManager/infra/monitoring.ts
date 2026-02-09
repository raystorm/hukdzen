import { Function } from 'aws-cdk-lib/aws-lambda';
import { Alarm, ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

export function createEmailPreferenceManagerMonitoring(
   scope: Construct,
   lambda: Function,
   alarmTopic: Topic,
   env: string
) {
   new Alarm(scope, 'EmailPreferenceManagerErrors', {
      metric: lambda.metricErrors(),
      threshold: 1,
      evaluationPeriods: 1,
      alarmName: `hukdzen-${env}-emailPreferenceManagerErrors`,
      alarmDescription: 'Email preference manager Lambda errors',
   })
   .addAlarmAction(new SnsAction(alarmTopic));
}

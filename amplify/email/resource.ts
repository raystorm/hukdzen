import { Stack } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as lambda from 'aws-cdk-lib/aws-lambda';

interface EmailResourceProps
{
   env: 'dev' | 'prod';
   stack: Stack;
}

export function createEmailResources(props: EmailResourceProps)
{
   const { env, stack } = props;

   const bounceTopic = new sns.Topic(stack, 'SESBounceTopic',
   {
      displayName: `Hukdzen ${env} SES Bounces`,
      topicName: `ses-bounces-${env}`,
   });

   const complaintTopic = new sns.Topic(stack, 'SESComplaintTopic',
   {
      displayName: `Hukdzen ${env} SES Complaints`,
      topicName: `ses-complaints-${env}`,
   });

   const configSet = new ses.ConfigurationSet(stack, 'SESConfigSet',
   { configurationSetName: `hukdzen-${env}`, });

   configSet.addEventDestination('BounceDestination',
   {
      destination: ses.EventDestination.snsTopic(bounceTopic),
      events: [ses.EmailSendingEvent.BOUNCE],
   });

   configSet.addEventDestination('ComplaintDestination',
   {
      destination: ses.EventDestination.snsTopic(complaintTopic),
      events: [ses.EmailSendingEvent.COMPLAINT],
   });

   return {
      configSetName: configSet.configurationSetName,
      bounceTopic,
      complaintTopic,
   };
}

export function subscribeEmailOptOut(
   bounceTopic: sns.Topic,
   complaintTopic: sns.Topic,
   emailOptOutHandler: lambda.IFunction
)
{
   bounceTopic.addSubscription(
      new subscriptions.LambdaSubscription(emailOptOutHandler)
   );
   complaintTopic.addSubscription(
      new subscriptions.LambdaSubscription(emailOptOutHandler)
   );
}

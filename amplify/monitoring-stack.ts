import { Stack, CfnOutput } from 'aws-cdk-lib';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { createCostMonitoring } from './monitoring/cost-alarms';
// import { createDashboard } from './monitoring/dashboard'; // Disabled: $3/month per env
import { createSearchCollection } from './search/resource';
import { createSearchMonitoring } from './search/monitoring';
import { createEmailResources } from './email/resource';
import { createEmailMonitoring } from './email/monitoring';
import { createStorageMonitoring } from './storage/monitoring';
import { createSearchRunnerMonitoring } from './functions/searchRunner/infra/monitoring';

interface MonitoringStackProps
{
   env: 'dev' | 'prod';
   region: string;
   alertEmail: string;
   costThreshold: number;
   emailOptOutHandlerArn?: string; // Optional - only if Lambda exists
   storageBucketName?: string; // Optional - only if storage exists
   searchRunnerArn?: string; // Optional - only if Lambda exists
}

export class MonitoringStack extends Stack
{
   public readonly opensearchCollectionEndpoint: string;
   public readonly opensearchCollectionArn: string;

   constructor(scope: Construct, id: string, props: MonitoringStackProps)
   {
      super(scope, id);

      const { env, region, alertEmail, costThreshold, emailOptOutHandlerArn } = props;

      const { alertTopic } = createCostMonitoring({
         env, region, stack: this, alertEmail, costThreshold,
      });

      const searchCollection = createSearchCollection({ env, stack: this });
      this.opensearchCollectionEndpoint = searchCollection.collectionEndpoint;
      this.opensearchCollectionArn = searchCollection.collectionArn;

      createSearchMonitoring({
         env, stack: this,
         collectionName: searchCollection.collectionName,
         alertTopic,
      });

      // Storage monitoring
      if (props.storageBucketName)
      { createStorageMonitoring({ env, stack: this, alertTopic }); }

      /* Email monitoring - enable when email Lambdas are added
      const emailResources = createEmailResources({
         env, stack: this, emailOptOutHandlerArn,
      });
      createEmailMonitoring({ env, stack: this, alertTopic });
      */

      /* Lambda monitoring - enable when searchRunner is added
      if (props.searchRunnerArn)
      {
         const searchRunnerFunction = LambdaFunction.fromFunctionArn(
            this,
            'SearchRunnerFunction',
            props.searchRunnerArn
         );
         createSearchRunnerMonitoring(this, searchRunnerFunction, alertTopic, env);
      }
      */

      /* CloudWatch Dashboard - DISABLED to save $3/month per environment ($6/month total)
       * Uncomment if visibility is worth the cost. Metrics are still available in CloudWatch console.
       *
      createDashboard({ env, region, stack: this,
                        collectionName: searchCollection.collectionName, });
      */

      new CfnOutput(this, 'OpenSearchEndpoint',
      {
         value: this.opensearchCollectionEndpoint,
         description: 'OpenSearch Serverless Collection Endpoint',
         exportName: `hukdzen-${env}-opensearch-endpoint`,
      });

      /* SES output - enable when email resources are added
      new CfnOutput(this, 'SESConfigSetName',
      {
         value: emailResources.configSetName,
         description: 'SES Configuration Set Name',
         exportName: `hukdzen-${env}-ses-config-set`,
      });
      */

      /* Dashboard URL output - disabled since dashboard is commented out
      new CfnOutput(this, 'DashboardUrl',
      {
         value: `https://console.aws.amazon.com/cloudwatch/home?region=${region}#dashboards:name=hukdzen-${env}-costs`,
         description: 'CloudWatch Dashboard URL',
      });
      */
   }
}

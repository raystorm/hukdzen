import { Stack, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { createCostMonitoring } from './monitoring/cost-alarms';
// import { createDashboard } from './monitoring/dashboard'; // Disabled: $3/month per env
import { createSearchCollection } from './search/resource';
import { createSearchMonitoring } from './search/monitoring';
import { createEmailResources } from './email/resource';
import { createEmailMonitoring } from './email/monitoring';
import { createAuthResources } from './auth/backend';
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

      const emailResources = createEmailResources({
         env, stack: this, emailOptOutHandlerArn,
      });

      createEmailMonitoring({ env, stack: this, alertTopic });

      createAuthResources({
         stack: this,
         userPoolId: process.env.USER_POOL_ID || 'PLACEHOLDER',
      });

      // Storage monitoring - only if storage bucket exists
      if (props.storageBucketName)
      {
         createStorageMonitoring({ env, stack: this, alertTopic });
      }

      // SearchRunner monitoring - only if Lambda exists
      if (props.searchRunnerArn)
      {
         const searchRunnerFunction = this.node.tryFindChild('searchRunner');
         if (searchRunnerFunction)
         {
            createSearchRunnerMonitoring(this, searchRunnerFunction as any, alertTopic, env);
         }
      }

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

      new CfnOutput(this, 'SESConfigSetName',
      {
         value: emailResources.configSetName,
         description: 'SES Configuration Set Name',
         exportName: `hukdzen-${env}-ses-config-set`,
      });

      /* Dashboard URL output - disabled since dashboard is commented out
      new CfnOutput(this, 'DashboardUrl',
      {
         value: `https://console.aws.amazon.com/cloudwatch/home?region=${region}#dashboards:name=hukdzen-${env}-costs`,
         description: 'CloudWatch Dashboard URL',
      });
      */
   }
}

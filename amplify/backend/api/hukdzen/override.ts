import {
    AmplifyApiGraphQlResourceStackTemplate,
    AmplifyProjectInfo
} from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyApiGraphQlResourceStackTemplate,
                         amplifyProjectInfo: AmplifyProjectInfo)
{
   /*
   // @ t s - i g n o r e
   resources.opensearch.OpenSearchDomain.index = {
     // existing mapping
     doc { keywords: { type: 'keyword' } }
   };
   */
}

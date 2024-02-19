import {
    AmplifyApiGraphQlResourceStackTemplate,
    AmplifyProjectInfo
} from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyApiGraphQlResourceStackTemplate,
                         amplifyProjectInfo: AmplifyProjectInfo)
{
   //@ts-ignore
   resources.opensearch.OpenSearchDomain.index = {
     // existing mapping
     keywords: { type: 'keyword' }
   };
}

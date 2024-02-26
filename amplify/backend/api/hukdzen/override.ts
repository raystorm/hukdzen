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
    let osPolicy = resources.opensearch.OpenSearchAccessIAMRoleDefaultPolicy;

    //TODO: Properly access the LambdaExecutionRole
    //osPolicy.roles[ { "Ref": "LambdaExecutionRole" } ];

    const user: string = (`arn:aws:sts::${process.env.ACCOUNT_ID}`
                          + ':assumed-role/hukdzenLambdaRole20138f42-dev/ingestTrigger-dev');
    osPolicy.users.push(user);

    const arn = (`arn:aws:es:${process.env.REGION}`
                     + `:${process.env.ACCOUNT_ID}`
                     + ':domain/amplify-opense-15yt42dqhtcb4/*');

    const statement = {
        "Effect":    "Allow",
        "Action":    ["es:ESHttpGet", "es:ESHttpHead",
                      "es:ESHttpPut", "es:ESHttpPost"],
        "Resource":  [arn],
        "Principal": {"AWS": [user]}
    };

    //osPolicy.policyDocument.Statement.push(statement);
    osPolicy.policyDocument.Statement = [statement];
}

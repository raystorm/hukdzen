import {
    AmplifyApiGraphQlResourceStackTemplate,
    AmplifyProjectInfo
} from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyApiGraphQlResourceStackTemplate,
                         amplifyProjectInfo: AmplifyProjectInfo)
{
    let osPolicy = resources.opensearch!.OpenSearchAccessIAMRoleDefaultPolicy;

    //TODO: Properly access the LambdaExecutionRole
    //osPolicy.roles[ { "Ref": "LambdaExecutionRole" } ];

    //parameterize this user for dev/prod
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
    //resources.opensearch.OpenSearchStreamingLambdaIAMRoleDefaultPolicy.policyDocument.Statement = [statement];

    /*
    let osRole = resources.opensearch.OpenSearchAccessIAMRole;

    let userArn = (`arn:aws:sts::${process.env.ACCOUNT_ID}:assumed-role/`
                         +'hukdzenLambdaRole20138f42-dev/ingestTrigger-dev');

    osRole.assumeRolePolicyDocument.Statement[0].Principal.AWS = [user];

    const roleStatement = {
        Effect:    'Allow',
        Principal: { AWS: userArn },
        Action:    [ 'sts:AssumeRole', "es:DescribeDomainHealth",
                     "es:ESHttpGet", "es:ESHttpHead",
                     "es:ESHttpPut", "es:ESHttpPost" ]
    }
    */
}

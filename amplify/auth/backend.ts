import { Stack } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';

interface AuthResourceProps
{
   stack: Stack;
   userPoolId: string;
}

export function createAuthResources(props: AuthResourceProps)
{
   const { stack, userPoolId } = props;

   const userPool = cognito.UserPool.fromUserPoolId(stack, 'UserPool',
                                                    userPoolId);

   new cognito.CfnUserPoolGroup(stack, 'WebAppAdminGroup',
   {
      userPoolId: userPool.userPoolId,
      groupName: 'WebAppAdmin',
      description: 'Web Application Administrators',
      precedence: 1,
   });
}

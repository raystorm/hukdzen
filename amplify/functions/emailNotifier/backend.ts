import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export function configureEmailNotifier(backend: any)
{
   const emailResources = backend.emailNotifier.resources as any;
   
   // Grant SES send email permissions
   emailResources.lambda.addToRolePolicy(
      new PolicyStatement({
         actions: ['ses:SendEmail', 'ses:SendRawEmail'],
         resources: ['*'],
      })
   );

   return backend.emailNotifier;
}

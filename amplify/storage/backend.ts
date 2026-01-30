export const configureStorage = (backend: any, env: string) =>
{
   const allowedOrigins = env === 'prod'
      ? ['https://smalgyax-files.org', 'https://prod.d1nnyhcu0aulq5.amplifyapp.com']
      : ['https://dev.smalgyax-files.org', 'https://dev.d1nnyhcu0aulq5.amplifyapp.com',
         'http://localhost:3000'];

   backend.storage.resources.bucket.versioned = false;
   backend.storage.resources.bucket.addCorsRule({
      allowedMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
      allowedOrigins: allowedOrigins,
      allowedHeaders: ['*'],
      exposedHeaders: ['x-amz-server-side-encryption', 'x-amz-request-id', 'x-amz-id-2', 'ETag'],
      maxAge: 3000,
   });

   // Future: Glacier transition for cost savings when storage grows
   // backend.storage.resources.bucket.addLifecycleRule({
   //    id: 'TransitionToGlacier',
   //    transitions: [{ storageClass: 'GLACIER', transitionAfter: 90 }],
   //    enabled: true,
   // });
};

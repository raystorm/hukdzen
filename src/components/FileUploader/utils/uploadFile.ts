import type {
  UploadDataInput,
  UploadDataWithPathOutput,
  UploadDataWithPathInput,
  UploadDataOutput,
} from '@aws-amplify/storage';
import { uploadData } from '@aws-amplify/storage';
import { isFunction } from '@aws-amplify/ui';

/**
 * Callback provided an input containing the current `identityId`
 *
 * @param {{identityId: string | undefined}} input - Input parameters
 * @returns target S3 bucket key
 */
export type PathCallback = (input: { identityId: string | undefined; }) => string;

export type UploadTask = UploadDataOutput | UploadDataWithPathOutput;
export interface TaskEvent {
  id: string;
  uploadTask: UploadTask;
}

// omit `path` callback, `path` must always be a string to support resolving
// `path` callback with `fileKey` and `identityId`
export type PathInput = Omit<UploadDataWithPathInput, 'path'> & { path: string; };

export type TaskHandler = (event: TaskEvent) => void;
export interface UploadFileProps {
  input: () => Promise<PathInput | UploadDataInput>;
  onComplete?: (
    result: Awaited<(UploadDataWithPathOutput | UploadDataOutput)['result']>
  ) => void;
  onError?: (event: { key: string; error: Error }) => void;
  onStart?: (event: { key: string; uploadTask: UploadTask }) => void;
}

type UploadDataType = (input: PathInput | UploadDataInput) =>
     UploadDataWithPathOutput | UploadDataOutput;

export async function uploadFile({ input, onError, onStart, onComplete }:
                                 UploadFileProps):
       Promise<UploadDataWithPathOutput | UploadDataOutput>
{
  const resolvedInput = await input();
  const uploadTask = (uploadData as UploadDataType)(resolvedInput);

  /*
  const file = resolvedInput.data as File;
  let uploadMe = {
    path: resolvedInput['path'] ?? resolvedInput['key'],
    //data: resolvedInput.data,
    data: new File([file], file.name, { type: file.type }),
    // @ts-ignore
    //options: { contentType: resolvedInput.options['contentType'] },
    options: resolvedInput.options,
  }

  console.log('resolvedInput', uploadMe);
  console.log('resolvedInput - stringify', JSON.stringify(uploadMe));

  let uploadTask = await (uploadData as UploadDataType)(uploadMe);
  */

  /*
  const massagedInput =  {
    path: resolvedInput['key'] ?? resolvedInput['path'],
    ...resolvedInput,
  };
  */

  // @ts-ignore
  //const uploadTask = await uploadData(massagedInput);

  //let key; //: PathInput | UploadDataInput;
  //if ( resolvedInput.hasOwnProperty('key') ) { key = resolvedInput["key"]; }
  //else { key = resolvedInput['path']; }
  const key = resolvedInput['key'] ?? resolvedInput['path'];

  //let uploadedTask: UploadDataWithPathOutput | UploadDataOutput;

  if (isFunction(onStart)) { onStart({ key, uploadTask }); }

  /*
  try
  {
    let result = await uploadTask.result;
    if (isFunction(onComplete) && uploadTask.state === 'SUCCESS')
    { onComplete(result); }
  }
  catch(error: any) //: Error
  { if (isFunction(onError)) { onError({ key, error}); } }
  finally { console.log("finished processing upload task.") }
  */

  if ( !(uploadTask.result instanceof Promise) )
  { console.error('uploadTask.result is not a Promise'); }

  /*
   uploadTask.result
    .then((result) => {
      if (isFunction(onComplete) && uploadTask.state === 'SUCCESS')
      {
        console.info('uploadTask: ' + JSON.stringify(uploadTask));
        console.info('About to Run onComplete');
        onComplete(result);
      }
    })
    .catch((error: Error) => {
      if (isFunction(onError)) { onError({ key, error }); }
    })
    .finally(() => {
      console.info('finished processing upload task.');
      console.log('uploadTask: ' + JSON.stringify(uploadTask));
    });
  */

  try
  {
    let result = await uploadTask.result;
    console.log('uploadTask ("await"): ' + JSON.stringify(uploadTask));
    if (isFunction(onComplete) && uploadTask.state === 'SUCCESS')
    {
      console.info('uploadTask: ' + JSON.stringify(uploadTask));
      console.info('About to Run onComplete');
      onComplete(result);
    }
  }
  catch(error: any) //: Error
  { if (isFunction(onError)) { onError({ key, error}); } }
  finally
  {
    console.info('finished processing upload task.');
    console.log('uploadTask: ' + JSON.stringify(uploadTask));
  }

  return uploadTask;
}

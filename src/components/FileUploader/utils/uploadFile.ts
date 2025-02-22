import {
  uploadData,
  UploadDataInput,
  UploadDataWithPathOutput,
  UploadDataWithPathInput,
  UploadDataOutput,
} from '@aws-amplify/storage';
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

type UploadData = (input: PathInput | UploadDataInput) =>
     UploadDataWithPathOutput | UploadDataOutput;

export async function uploadFile({ input, onError, onStart, onComplete,}:
                                 UploadFileProps):
       Promise<UploadDataWithPathOutput | UploadDataOutput>
{
  const resolvedInput = await input();
  const uploadTask = (uploadData as UploadData)(resolvedInput);

  let key;
  if ( resolvedInput.hasOwnProperty('key') ) { key = resolvedInput["key"]; }
  else { key = resolvedInput['path']; }

  if (isFunction(onStart)) { onStart({ key, uploadTask }); }

  /*
  try
  {
    let result = await uploadTask.result;
    if (isFunction(onComplete) && uploadTask.state === 'SUCCESS')
    { onComplete(result); }
  }
  catch(error: any) //: Error
  {
    if (isFunction(onError)) { onError({ key, error}); }
  }
  finally
  { console.log("finished processing upload task.") }
  */

  if ( !(uploadTask.result instanceof Promise) )
  { console.error('uploadTask.result is not a Promise'); }

  uploadTask.result
    .then((result) => {
      if (isFunction(onComplete) && uploadTask.state === 'SUCCESS')
      { onComplete(result); }
    })
    .catch((error: Error) => {
      if (isFunction(onError)) { onError({ key, error }); }
    })
    .finally(() => { console.info('finished processing upload task.') });

  return uploadTask;
}

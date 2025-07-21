import { isFunction } from '@aws-amplify/ui';
import type {
  ProcessFile, ProcessFileError,
  ProcessFileErrorParams, ProcessFileParams,
} from '../types';
import { UseFileUploader } from '../hooks/useFileUploader/useFileUploader';

interface handleErrorParams {
  rejected: Error | string;
  input: ProcessFileParams;
  removeUpload: UseFileUploader['removeUpload'];
  id: string;
  onProcessFileError?: ProcessFileError;
}

/**
 *  Error Handler to wrap `onProcessFileError()`
 *  @param rejected Error
 *  @param input  Data about file being rejected
 *  @param removeUpload function to stop the upload
 *  @param id id number of the file
 *  @param onProcessFileError optional user function to respond to the error
 */
const handleError = ({ rejected, input, removeUpload, id, onProcessFileError, }:
      handleErrorParams) =>
{
  const errorParams: ProcessFileErrorParams = {
    error: rejected,
    file: input.file,
    key: input.key,
    useAccelerateEndpoint: input.useAccelerateEndpoint,
  };
  if (isFunction(onProcessFileError)) { onProcessFileError(errorParams); }

  removeUpload({ id });

  return errorParams;
};

/**
 * Utility function that takes the processFile prop, along with a file a key
 * and returns a Promise that resolves to { file, key, ..rest }
 * regardless if processFile is defined and if it is sync or async
 */
export const resolveFile = ({ processFile, onProcessFileError, removeUpload, id,
                              ...input }:
       ProcessFileParams & {
  processFile?: ProcessFile;
  onProcessFileError?: ProcessFileError;
  removeUpload: UseFileUploader['removeUpload'];
  id: string;
}): Promise<ProcessFileParams> => {
  return new Promise((resolve, reject) => {
    let result;
    try { result = isFunction(processFile) ? processFile(input) : input; }
    catch (error)
    {
      handleError({ rejected : error as Error | string,
                    input, removeUpload, id, onProcessFileError, });
      result = input;
    }
    if (result instanceof Promise)
    {
      result.then(resolve).catch((error) => {
        handleError({ rejected: error as Error | string,
                      input, removeUpload, id, onProcessFileError });
      });
    }
    else { resolve(result); }
  });
};

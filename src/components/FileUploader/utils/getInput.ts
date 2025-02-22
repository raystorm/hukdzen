import { fetchAuthSession } from 'aws-amplify/auth';
import { UploadDataWithPathInput, UploadDataInput } from '@aws-amplify/storage';

import { isString, isFunction } from '@aws-amplify/ui';

import { ProcessFile, ProcessFileErrorParams, StorageAccessLevel } from '../types';
import { resolveFile } from './resolveFile';
import { PathCallback, PathInput } from './uploadFile';
import { UseFileUploader } from '../hooks/useFileUploader/useFileUploader';

export interface GetInputParams {
  accessLevel: StorageAccessLevel | undefined;
  file: File;
  key: string;
  onProcessFileError?: (error: ProcessFileErrorParams) => void;
  onProgress: NonNullable<UploadDataWithPathInput['options']>['onProgress'];
  path: string | PathCallback | undefined;
  processFile: ProcessFile | undefined;
  useAccelerateEndpoint?: boolean;
  id: string;
  removeUpload: UseFileUploader['removeUpload'];
}

export const getInput = ({ accessLevel, file, key, onProcessFileError, onProgress,
                           path, processFile, id, removeUpload, useAccelerateEndpoint,
                         }: GetInputParams) =>
{
  return async (): Promise<PathInput | UploadDataInput> => {
    const hasCallbackPath = isFunction(path);
    const hasStringPath = isString(path);

    const hasKeyInput = !!accessLevel && !hasCallbackPath;

    const { file: data, key: processedKey, ...rest } =
      await resolveFile({file, key, processFile, removeUpload, id,
                         onProcessFileError});

    const contentType = file.type || 'binary/octet-stream';

    // IMPORTANT: always pass `...rest` here for backwards compatibility
    const options = { contentType, onProgress, useAccelerateEndpoint, ...rest };

    let inputResult: PathInput | UploadDataInput;

    if (hasKeyInput)
    {
      // legacy handling of `path` is to prefix to `fileKey`
      const resolvedKey = hasStringPath ? `${path}${processedKey}` : processedKey;

      inputResult = {
        data,
        key: resolvedKey,
        options: { ...options, accessLevel },
      };
    }
    else
    {
      const { identityId } = await fetchAuthSession();
      const resolvedPath = `${
        hasCallbackPath ? path({ identityId }) : path
      }${processedKey}`;

      inputResult = { data: file, path: resolvedPath, options };
    }

    return inputResult;
  };
};

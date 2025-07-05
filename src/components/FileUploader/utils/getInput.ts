import { fetchAuthSession } from 'aws-amplify/auth';
import type {
  UploadDataWithPathInput, UploadDataInput,
} from 'aws-amplify/storage';

import { isString, isFunction } from '@aws-amplify/ui';

import type {
  ProcessFile, ProcessFileErrorParams,
  StorageAccessLevel, StorageBucket
} from '../types';
import { resolveFile } from './resolveFile';
import type { PathCallback, PathInput } from './uploadFile';
import { UseFileUploader } from '../hooks/useFileUploader/useFileUploader';

export interface GetInputParams {
  accessLevel: StorageAccessLevel | undefined;
  bucket?: StorageBucket;
  file: File;
  key: string;
  path: string | PathCallback | undefined;
  onProgress: NonNullable<UploadDataWithPathInput['options']>['onProgress'];
  processFile: ProcessFile | undefined;
  onProcessFileError?: (error: ProcessFileErrorParams) => void;
  useAccelerateEndpoint?: boolean;
  id: string;
  removeUpload: UseFileUploader['removeUpload'];
}

export const getInput = ({
  accessLevel, bucket, file, key, path, onProgress,
  processFile, onProcessFileError, id, removeUpload, useAccelerateEndpoint,
}: GetInputParams) => {
  return async (): Promise<PathInput | UploadDataInput> => {
    const hasCallbackPath = isFunction(path);
    const hasStringPath = isString(path);

    const hasKeyInput = !!accessLevel && !hasCallbackPath;

    const { file: data, key: processedKey, ...rest } =
      await resolveFile({ file, key, processFile, removeUpload, id,
                          onProcessFileError });

    const contentType = file.type || 'binary/octet-stream';

    // IMPORTANT: always pass `...rest` here for backwards compatibility
    const options = {
      bucket,
      contentType,
      onProgress,
      useAccelerateEndpoint,
      ...rest,
    };

    let inputResult: PathInput | UploadDataInput;

    if (hasKeyInput)
    { // legacy handling of `path` is to prefix to `fileKey`
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

      inputResult = { data, path: resolvedPath, options };
    }

    return inputResult;
  };
};

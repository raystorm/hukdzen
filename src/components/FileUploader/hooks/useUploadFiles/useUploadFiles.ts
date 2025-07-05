import * as React from 'react';

import type { TransferProgressEvent } from '@aws-amplify/storage';
import { isFunction } from '@aws-amplify/ui';

import type { PathCallback } from '../../utils/uploadFile';
import { uploadFile } from '../../utils/uploadFile';
import { getInput } from '../../utils/getInput';
import type { FileUploaderProps, StorageBucket } from '../../types';
import { FileStatus } from '../../types';
import type { UseFileUploader } from '../useFileUploader/useFileUploader';

export interface UseUploadFilesProps
  extends Pick<
      FileUploaderProps,
      | 'isResumable'
      | 'onUploadSuccess' | 'onUploadError' | 'onUploadStart'
      | 'maxFileCount'
      | 'processFile' | 'onProcessFileError'
      | 'useAccelerateEndpoint'
    >,
    Pick<
      UseFileUploader,
      | 'setUploadingFile' | 'setUploadProgress' | 'setUploadSuccess'
      | 'files' | 'removeUpload'
    > {
  accessLevel?: FileUploaderProps['accessLevel'];
  bucket?: StorageBucket;
  path?: string | PathCallback;
}

export function useUploadFiles({
  accessLevel,
  bucket,
  files,
  isResumable,
  maxFileCount,
  removeUpload,
  onUploadError,
  onUploadStart,
  onUploadSuccess,
  path,
  processFile,
  onProcessFileError,
  setUploadingFile,
  setUploadProgress,
  setUploadSuccess,
  useAccelerateEndpoint,
}: UseUploadFilesProps): void {
  //ref Object used to prevent duplicate uploads
  const uploadingRef = React.useRef(new Set<string>());
  React.useEffect(() => {
    const filesReadyToUpload = files.filter(
      (file) => file.status === FileStatus.QUEUED
                                && !uploadingRef.current.has(file.id)
    );

    if (filesReadyToUpload.length > maxFileCount) { return; }

    for (const { file, key, id } of filesReadyToUpload)
    {
      uploadingRef.current.add(id); //must run here BEFORE onStart

      const onProgress = (event: TransferProgressEvent): void =>
      {
        /**
         * When a file is zero bytes, the progress.total will equal zero.
         * Therefore, this will prevent a divide by zero error.
         */
        const progress =
          event.totalBytes === undefined || event.totalBytes === 0 ? 100 :
                Math.floor((event.transferredBytes / event.totalBytes) * 100);
        setUploadProgress({ id, progress });
      };

      if (file)
      {
        console.log(`Uploading file [${key}]...`);
        const input = getInput({
          accessLevel, bucket, file, key, path,
          onProgress, processFile, onProcessFileError,
          useAccelerateEndpoint,
          id, removeUpload,
        });

        uploadFile({
          input,
          onComplete: (event) => {
            uploadingRef.current.delete(id);
            const resolvedKey =
              (event as { key: string }).key ??
              (event as { path: string }).path;// ??
              //(event as { resolvedKey: string }).resolvedKey;

            if (isFunction(onUploadSuccess))
            { onUploadSuccess({ key: resolvedKey }); }
            setUploadSuccess({ id, resolvedKey });
          },
          onError: ({ key, error }) => {
            uploadingRef.current.delete(id);
            console.error(`Error uploading file [${key}]:`, error);
            if (isFunction(onUploadError))
            { onUploadError(error.message, { key }); }
          },
          onStart: ({ key, uploadTask }) => {
            uploadingRef.current.add(id);
            console.debug(`Starting upload for file [${key}]`);
            if (isFunction(onUploadStart)) { onUploadStart({ key }); }
            setUploadingFile({ id, uploadTask });
          },
        });
      }
    }
  }, [ files, accessLevel, bucket, path, isResumable, maxFileCount,
       setUploadProgress, setUploadingFile, removeUpload,
       onUploadStart, onUploadSuccess, setUploadSuccess, onUploadError,
       processFile, onProcessFileError,
       useAccelerateEndpoint,
  ]);
}

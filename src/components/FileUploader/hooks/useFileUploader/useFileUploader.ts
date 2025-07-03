import React from 'react';

import {isObject} from '@aws-amplify/ui';

import {DefaultFile, FileStatus, StorageFiles} from '../../types';
import {GetFileErrorMessage} from '../../../../FileUploader/fileUploaderTypes';
import {fileUploaderActions, fileUploaderReducer} from "../../../../FileUploader/fileUploaderSlice";
import {TaskHandler} from '../../utils/uploadFile';

export interface UseFileUploader {
  addFiles: (params: {
    files: File[];
    status: FileStatus;
    getFileErrorMessage: GetFileErrorMessage;
  }) => void;
  clearFiles: () => void;
  files: StorageFiles;
  queueFiles: () => void;
  removeUpload: (params: { id: string }) => void;
  setUploadingFile: TaskHandler;
  setUploadPaused: (params: { id: string }) => void;
  setUploadProgress: (params: { id: string; progress: number }) => void;
  setUploadResumed: (params: { id: string }) => void;
  setUploadSuccess: (params: { id: string; resolvedKey: string }) => void;
}

const { addFiles, clearFiles, queueFiles, removeUpload,
        setStatusUploading, setStatusUploaded, setStatus, setUploadProgress,
} = fileUploaderActions;

const isDefaultFile = (file: unknown): file is DefaultFile =>
  !!(isObject(file) && (file as DefaultFile).key);

const createFileFromDefault = (file: DefaultFile) =>
  isDefaultFile(file)
    ? { ...file, id: file.key, status: FileStatus.UPLOADED }
    : undefined;

export function useFileUploader(
   defaultFiles: Array<DefaultFile> = []
): UseFileUploader {
  const [{ files }, dispatch] = React.useReducer<typeof fileUploaderReducer>(
     fileUploaderReducer, {
    files: (Array.isArray(defaultFiles)
      ? defaultFiles.map(createFileFromDefault).filter((file) => !!file)
      : []) as StorageFiles,
  });

  const dispatchers: Omit<UseFileUploader, 'files'> = React.useMemo(
    () => ({
      addFiles: (params) => { dispatch(addFiles(params)); },
      clearFiles: () => { dispatch(clearFiles()); },
      queueFiles: () => { dispatch(queueFiles()); },

      setUploadingFile: (params) => { dispatch(setStatusUploading(params)); },
      setUploadProgress: (params) => { dispatch(setUploadProgress(params)); },
      setUploadSuccess: (params) => {
         dispatch(setStatusUploaded({ id: params.id,
                                      resolvedKey: params.resolvedKey,
                                      status: FileStatus.UPLOADED
                                    }));
      },
      setUploadPaused: ({ id }) => {
        dispatch(setStatus({ id, status: FileStatus.PAUSED }));
      },
      setUploadResumed: ({ id }) => {
        dispatch(setStatus({ id, status: FileStatus.UPLOADING }));
      },

      removeUpload: ({ id }) => { dispatch(removeUpload({ id })); },
    }),
    []
  );

  return { ...dispatchers, files };
}

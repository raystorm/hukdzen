import { FileStatus, StorageFiles } from '../components/FileUploader/types';
import { UploadTask } from '../components/FileUploader/utils/uploadFile';


export interface UseFileUploaderState {
  files: StorageFiles;
  status?: FileStatus;
}

export type GetFileErrorMessage = (file: File) => string;

export type AddFilesAction = //(params: AddFilesActionParams) => void;
{
   files: File[];
   status: FileStatus;
   getFileErrorMessage: GetFileErrorMessage;
}

export type SetStatusAction = {
   id: string;
   status: FileStatus;
}

export type SetStatusUploadingAction = {
   id: string;
   uploadTask?: UploadTask;
}

export type SetUploadProgressAction = {
   id: string;
   progress: number;
}

export type SetStatusUploadedAction =
{
   id: string;
   resolvedKey: string;
   status: FileStatus.UPLOADED;
}

export type RemoveUploadAction = { id: string; }

export type Action =
  AddFilesAction
  | SetStatusAction
  | SetStatusUploadingAction
  | SetUploadProgressAction
  | SetStatusUploadedAction
  | RemoveUploadAction;

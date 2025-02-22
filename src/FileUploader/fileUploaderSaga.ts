import {call, put, takeLatest, takeLeading} from 'redux-saga/effects'
import { generateClient } from "@aws-amplify/api";

import { FileStatus, StorageFile, StorageFiles } from '../components/FileUploader/types';
import {
  Action,
  AddFilesAction,
  RemoveUploadAction,
  SetStatusAction,
  SetStatusUploadingAction,
  SetUploadProgressAction,
  SetStatusUploadedAction,
  UseFileUploaderState
} from './fileUploaderTypes';
import { fileUploaderActions } from "./fileUploaderSlice";

import {AlertBarProps} from "../AlertBar/AlertBarNotifier";
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {buildErrorAlert, buildSuccessAlert} from "../AlertBar/AlertBarTypes";
import {appSelect} from "../app/hooks";
import {useFileUploader} from "../components/FileUploader/hooks/useFileUploader/useFileUploader";

/*
 * **NOTE:** This is a skeleton placeholder file.
 * Eventually, I would like to Simplify the FileUploader Logic from the original AWS code
 * and use a Saga based Solution with the AWS Storage API.
 * In theory this should simplify and Unify Document Storage Management, without costing flexibility.
 */


export function* handleQueueFiles(): any
{
  const files: UseFileUploaderState = yield appSelect(state => state.fileUploader);

  //useFileUploader(files.files)

}


export function* watchFileUploaderSaga()
{
  //yield takeLatest(Action.AddFiles, handleAddFiles);
  //yield takeLatest(Action.RemoveUpload, handleRemoveUpload);
  //yield takeLatest(Action.SetUploadProgress, handleSetUploadProgress);
}
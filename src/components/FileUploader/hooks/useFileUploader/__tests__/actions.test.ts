import { UploadDataOutput } from 'aws-amplify/storage';

import { FileStatus } from '../../../types';
import { fileUploaderActions }
  from "../../../../../FileUploader/fileUploaderSlice";

const { addFiles, clearFiles, queueFiles, removeUpload,
        setUploadProgress, setStatus, setStatusUploading, setStatusUploaded,
} = fileUploaderActions;

describe('addFilesAction', () => {
  it('creates an action with the ADD_FILES type and the given files and error message',
     () =>
  {
    const files = [new File(['file contents'], 'filename')];
    const status = FileStatus.QUEUED;
    const getFileErrorMessage = () => 'Something went wrong';

    const expectedAction = {
      payload: { files, status, getFileErrorMessage, },
      type: 'fileUploader/addFiles',
    };
    const action = addFiles({ files, status, getFileErrorMessage });
    expect(action).toEqual(expectedAction);
  });
});

describe('queueFilesAction', () => {
  it('creates an action with the QUEUE_FILES type', () => {
    const expectedAction = {
      payload: undefined,
      type: 'fileUploader/queueFiles',
    };
    const action = queueFiles();
    expect(action).toEqual(expectedAction);
  });
});

describe('clearFilesAction', () => {
  it('creates an action with the CLEAR_FILES type', () => {
    const expectedAction = {
      payload: undefined,
      type: 'fileUploader/clearFiles',
    };
    const action = clearFiles();
    expect(action).toEqual(expectedAction);
  });
});

describe('setUploadingFileAction', () => {
  it('creates an action with the SET_STATUS_UPLOADING type and the given id and upload task', () => {
    const id = 'test-id';
    const uploadTask = {} as UploadDataOutput;
    const expectedAction = {
      payload: { id, uploadTask, },
      type: 'fileUploader/setStatusUploading',
    };
    const action = setStatusUploading({ id, uploadTask });
    expect(action).toEqual(expectedAction);
  });
});

describe('setUploadProgressAction', () => {
  it('creates an action with the SET_UPLOAD_PROGRESS type and the given id and progress', () => {
    const id = 'test-id';
    const progress = 50;
    const expectedAction = {
      payload: { id, progress, },
      type: 'fileUploader/setUploadProgress',
    };
    const action = setUploadProgress({ id, progress });
    expect(action).toEqual(expectedAction);
  });
});

describe('setUploadStatusAction', () => {
  it('creates an action with the SET_STATUS type and the given file status', () => {
    const id = 'test-id';
    const status = FileStatus.PAUSED;
    const expectedAction = {
      payload: { id, status, },
      type: 'fileUploader/setStatus',
    };
    const action = setStatus({ id, status });
    expect(action).toEqual(expectedAction);
  });
});

describe('removeUploadAction', () => {
  it('creates an action with the REMOVE_UPLOAD type', () => {
    const id = 'test-id';
    const expectedAction = {
      payload: { id, },
      type: 'fileUploader/removeUpload',
    };
    const action = removeUpload({ id });
    expect(action).toEqual(expectedAction);
  });
});

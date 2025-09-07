import { vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducer } from 'react';

import { UploadDataOutput } from 'aws-amplify/storage';

import { fileUploaderReducer }
  from '../../../../../FileUploader/fileUploaderSlice';
import { Action, UseFileUploaderState, }
  from '../../../../../FileUploader/fileUploaderTypes';
import { FileStatus, StorageFile, StorageFiles } from '../../../types';
import { fileUploaderActions }
  from '../../../../../FileUploader/fileUploaderSlice';

const { addFiles, clearFiles, queueFiles, removeUpload,
        setStatus, setStatusUploading, setStatusUploaded, setUploadProgress,
} = fileUploaderActions;

const imageFile = new File(['hello'], 'hello.png', { type: 'image/png' });
const initialState: UseFileUploaderState = { files: [], };

// mock Date.now() so we can get accurate file IDs
const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => 1487076708000);

describe('fileUploaderStateReducer', () => {
  beforeEach(() => { dateSpy.mockClear(); });

  it('should add files to state on ADD_FILES action', () => {
    const addFilesAction : Action = {
      files: [imageFile],
      status: FileStatus.QUEUED,
      getFileErrorMessage: vi.fn().mockReturnValue('Test error'),
    };

    const expectedFiles: StorageFiles = [
      {
        id: `${Date.now()}-${imageFile.name}`,
        file: imageFile,
        error: 'Test error',
        key: imageFile.name,
        status: FileStatus.ERROR,
        isImage: true,
        progress: -1,
      },
    ];
    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(fileUploaderReducer, initialState);
      return { state, dispatch };
    });

    expect(result.current.state.files).toStrictEqual([]);

    act(() => result.current.dispatch(addFiles(addFilesAction)));

    expect(result.current.state.files).toStrictEqual(expectedFiles);
  });

  it('should clear files from state on CLEAR_FILES action', () => {
    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(fileUploaderReducer, {
        files: [
          {
            id: imageFile.name,
            file: imageFile,
            error: '',
            key: imageFile.name,
            status: FileStatus.UPLOADING,
            isImage: true,
            progress: -1,
          },
        ],
      });
      return { state, dispatch };
    });

    act(() => result.current.dispatch(clearFiles()));

    expect(result.current.state.files).toEqual([]);
  });

  it('should set uploading status and progress on SET_STATUS_UPLOADING action', () => {
    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(fileUploaderReducer, {
        files: [
          {
            id: imageFile.name,
            file: imageFile,
            error: '',
            key: imageFile.name,
            status: FileStatus.QUEUED,
            isImage: true,
            progress: -1,
          },
        ],
      });
      return { state, dispatch };
    });

    const testUploadTask = {} as UploadDataOutput;
    const uploadingAction: Action = {
      id: imageFile.name,
      uploadTask: testUploadTask,
    };
    act(() => result.current.dispatch(setStatusUploading(uploadingAction)));

    const expectedFiles: StorageFiles = [
      {
        id: imageFile.name,
        file: imageFile,
        error: '',
        key: imageFile.name,
        status: FileStatus.UPLOADING,
        isImage: true,
        progress: 0,
        uploadTask: testUploadTask,
      },
    ];
    expect(result.current.state.files).toEqual(expectedFiles);
  });

  it('should set upload progress of a file on SET_UPLOAD_PROGRESS action', () => {
    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(fileUploaderReducer, {
        files: [
          {
            id: imageFile.name,
            file: imageFile,
            error: '',
            key: imageFile.name,
            status: FileStatus.UPLOADING,
            isImage: true,
            progress: -1,
          },
        ],
      });
      return { state, dispatch };
    });

    const uploadProgressAction: Action = {
      id: imageFile.name,
      progress: 50,
    };
    act(() => result.current.dispatch(setUploadProgress(uploadProgressAction)));

    const expectedFiles: StorageFiles = [
      {
        id: imageFile.name,
        file: imageFile,
        error: '',
        key: imageFile.name,
        status: FileStatus.UPLOADING,
        isImage: true,
        progress: 50,
      },
    ];
    expect(result.current.state.files).toEqual(expectedFiles);
  });

  it('should return previous state if file not found on SET_UPLOAD_PROGRESS action', () => {
    const file: StorageFile = {
      id: imageFile.name,
      file: imageFile,
      error: '',
      key: imageFile.name,
      status: FileStatus.UPLOADING,
      isImage: true,
      progress: -1,
    };
    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(fileUploaderReducer, { files: [file], });
      return { state, dispatch };
    });

    const uploadProgressAction: Action = {
      //type: FileUploaderActionTypes.SET_UPLOAD_PROGRESS,
      id: 'not-found',
      progress: 50,
    };
    act(() => result.current.dispatch(setUploadProgress(uploadProgressAction)));

    expect(result.current.state.files).toEqual([file]);
  });

  it('should update the status of a file progress of a file on SET_STATUS action', () => {
    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(fileUploaderReducer, {
        files: [
          {
            id: imageFile.name,
            file: imageFile,
            error: '',
            key: imageFile.name,
            status: FileStatus.UPLOADING,
            isImage: true,
            progress: -1,
          },
        ],
      });
      return { state, dispatch };
    });

    const setStatusAction: Action = {
      id: imageFile.name,
      status: FileStatus.UPLOADED,
    };
    act(() => result.current.dispatch(setStatus(setStatusAction)));

    const expectedFiles: StorageFiles = [
      {
        id: imageFile.name,
        file: imageFile,
        error: '',
        key: imageFile.name,
        status: FileStatus.UPLOADED,
        isImage: true,
        progress: -1,
      },
    ];
    expect(result.current.state.files).toEqual(expectedFiles);
  });

  it('should return previous state if file not found on SET_STATUS action',
     () =>
  {
    const file: StorageFile = {
      id: imageFile.name,
      file: imageFile,
      error: '',
      key: imageFile.name,
      status: FileStatus.UPLOADING,
      isImage: true,
      progress: -1,
    };
    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(fileUploaderReducer, { files: [file], });
      return { state, dispatch };
    });

    const setStatusAction: Action = {
      id: 'not-found',
      status: FileStatus.UPLOADED,
    };
    act(() => result.current.dispatch(setStatus(setStatusAction)));

    expect(result.current.state.files).toEqual([file]);
  });

  it('should remove file from state on REMOVE_UPLOAD action', () => {
    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(fileUploaderReducer, {
        files: [
          {
            id: imageFile.name,
            file: imageFile,
            error: '',
            key: imageFile.name,
            status: FileStatus.UPLOADING,
            isImage: true,
            progress: -1,
          },
        ],
      });
      return { state, dispatch };
    });

    const removeUploadAction: Action = { id: imageFile.name, };
    act(() => result.current.dispatch(removeUpload(removeUploadAction)));

    expect(result.current.state.files).toEqual([]);
  });

  it('should return previous state if file not found on REMOVE_UPLOAD action', () => {
    const file: StorageFile = {
      id: imageFile.name,
      file: imageFile,
      error: '',
      key: imageFile.name,
      status: FileStatus.UPLOADING,
      isImage: true,
      progress: -1,
    };
    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(fileUploaderReducer, { files: [file], });
      return { state, dispatch };
    });

    const removeUploadAction: Action = { id: 'not-found', };
    act(() => result.current.dispatch(removeUpload(removeUploadAction)));

    expect(result.current.state.files).toEqual([file]);
  });

  it('updates the resolvedKey of a target file on SET_STATUS_SUCESS', () => {
    const file: StorageFile = {
      id: imageFile.name,
      file: imageFile,
      error: '',
      key: imageFile.name,
      status: FileStatus.QUEUED,
      isImage: true,
      progress: -1,
    };

    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(fileUploaderReducer, { files: [file], });
      return { state, dispatch };
    });

    const resolvedKey = `processed-${imageFile.name}`;
    const action: Action = {
      id: imageFile.name,
      resolvedKey,
      status: FileStatus.UPLOADED,
    };

    expect(result.current.state.files[0].resolvedKey).toBeUndefined();

    act(() => result.current.dispatch(setStatusUploaded(action)));

    expect(result.current.state.files[0].resolvedKey).toBe(resolvedKey);
  });

  it('should only change added files to queued in QUEUE_FILES action', () => {
    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(fileUploaderReducer, {
        files: [
          {
            id: imageFile.name,
            file: imageFile,
            error: '',
            key: imageFile.name,
            status: FileStatus.ADDED,
            isImage: true,
            progress: -1,
          },
          {
            id: imageFile.name,
            file: imageFile,
            error: '',
            key: imageFile.name,
            status: FileStatus.UPLOADED,
            isImage: true,
            progress: 100,
          },
        ],
      });
      return { state, dispatch };
    });

    act(() => result.current.dispatch(queueFiles()));

    expect(result.current.state.files).toEqual([
      {
        id: imageFile.name,
        file: imageFile,
        error: '',
        key: imageFile.name,
        status: FileStatus.QUEUED,
        isImage: true,
        progress: -1,
      },
      {
        id: imageFile.name,
        file: imageFile,
        error: '',
        key: imageFile.name,
        status: FileStatus.UPLOADED,
        isImage: true,
        progress: 100,
      },
    ]);
  });
});

import { renderHook, waitFor } from '@testing-library/react';
import * as Storage from '@aws-amplify/storage';
import { when } from 'jest-when';

import { FileStatus, StorageFile, FileUploaderProps } from '../../../types';
import { useUploadFiles, UseUploadFilesProps } from '../useUploadFiles';

const uploadDataSpy = jest
  .spyOn(Storage, 'uploadData')
  .mockImplementation((input) => {
    return {
      cancel: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      state: 'SUCCESS',
      result: Promise.resolve({ key: input.key, data: input.data }),
    };
  });

const mockUploadingFile: StorageFile = {
  id: 'uploading',
  status: FileStatus.UPLOADING,
  progress: 0,
  error: '',
  isImage: false,
  key: '',
};

const imageFile = new File(['hello'], 'hello.png', { type: 'image/png' });

const mockQueuedFile: StorageFile = {
  id: 'queued',
  status: FileStatus.QUEUED,
  progress: 0,
  error: '',
  isImage: false,
  key: 'key',
  file: imageFile,
};

const mockOnUploadError      = jest.fn();
const mockOnUploadStart      = jest.fn();
const mockSetUploadingFile   = jest.fn();
const mockSetUploadProgress  = jest.fn();
const mockSetUploadSuccess   = jest.fn();
const mockRemoveUpload       = jest.fn();
const mockOnProcessFileError = jest.fn();


const props: Omit<UseUploadFilesProps, 'files'> = {
  accessLevel: 'guest',
  maxFileCount: 2,
  isResumable: false,
  onUploadError: mockOnUploadError,
  onUploadStart: mockOnUploadStart,
  setUploadingFile: mockSetUploadingFile,
  setUploadProgress: mockSetUploadProgress,
  setUploadSuccess: mockSetUploadSuccess,
  onProcessFileError: mockOnProcessFileError,
  removeUpload: mockRemoveUpload
};

describe('useUploadFiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    when(Storage.uploadData).mockImplementation((input) => {
         return {
           cancel: jest.fn(),
           pause: jest.fn(),
           resume: jest.fn(),
           state: 'SUCCESS',
           result: Promise.resolve({ key: input.key, data: input.data }),
                                   //{ path: input.path, data: input.data }),
         };
       }
    );
  });

  it('should upload all queued files', async () => {
    renderHook(() =>
      useUploadFiles({ ...props, files: [mockUploadingFile, mockQueuedFile] })
    );

    await waitFor(() => {
      expect(mockSetUploadingFile).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(mockSetUploadingFile).toHaveBeenCalledWith({
        id: mockQueuedFile.id,
        uploadTask: expect.any(Object),
      });

      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(mockSetUploadSuccess).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(mockSetUploadSuccess).toHaveBeenCalledWith({
        id: mockQueuedFile.id,
        resolvedKey: 'key',
      });
    });

    expect(mockSetUploadingFile).not.toHaveBeenCalledWith({id: mockUploadingFile.id,});

    expect(mockSetUploadSuccess).not.toHaveBeenCalledWith({id: mockUploadingFile.id});
    expect(mockOnUploadError).not.toHaveBeenCalled();
  });

  it('should upload all resumable queued files', async () => {
    renderHook(() =>
      useUploadFiles({
        ...props,
        isResumable: true,
        files: [mockUploadingFile, mockQueuedFile],
      })
    );

    await waitFor(() => {
      expect(mockSetUploadingFile).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(mockSetUploadingFile).toHaveBeenCalledWith({
        id: mockQueuedFile.id,
        uploadTask: expect.any(Object),
      });
    });

    expect(mockSetUploadingFile).not.toHaveBeenCalledWith({id: mockUploadingFile.id});
  });

  it('should do nothing if number of queued files exceeds max number of files',
     async () =>
  {
    renderHook(() =>
      useUploadFiles({ ...props, maxFileCount: 0, files: [mockQueuedFile] })
    );

    expect(mockSetUploadingFile).not.toHaveBeenCalled();

    await waitFor(() => { expect(mockSetUploadSuccess).not.toHaveBeenCalled(); });
  });

  it('should call onUploadError when upload fails', async () => {
    const errorMessage = new Error('Error');
    uploadDataSpy.mockImplementationOnce(() => {
      return {
        cancel: jest.fn(),
        pause: jest.fn(),
        resume: jest.fn(),
        state: 'ERROR',
        result: Promise.reject(errorMessage),
      };
    });
    renderHook(() => useUploadFiles({ ...props, files: [mockQueuedFile] }));

    await waitFor(() => {
      expect(mockOnUploadError).toHaveBeenCalledTimes(1);
    });
    expect(mockOnUploadError).toHaveBeenCalledWith('Error', { key: 'key' });
  });

  it('should start upload after processFile', async () => {
    const processFile: FileUploaderProps['processFile'] = ({ file }) => ({
      file,
      key: 'test.png',
    });

    renderHook(() =>
      useUploadFiles({
        ...props,
        isResumable: true,
        processFile,
        files: [mockQueuedFile],
      })
    );

    await waitFor(() => {
      expect(mockOnUploadStart).toHaveBeenCalledWith({ key: 'test.png' });
    });
  });

  it('should start upload after processFile promise resolves',
     async () =>
  {
    const processFile: FileUploaderProps['processFile'] = ({ file }) =>
      new Promise((resolve) => resolve({ file, key: 'test.png' }));

    renderHook(() =>
      useUploadFiles({
        ...props,
        isResumable: true,
        processFile,
        files: [mockQueuedFile],
      })
    );

    await waitFor(() => {
      expect(mockOnUploadStart).toHaveBeenCalledWith({ key: 'test.png' });
    });
  });

  it('should remove upload after processFile promise rejects',
     async () =>
  {
    const forcedError = { error: 'forced test error', key: mockQueuedFile.key };

    const processFile: FileUploaderProps['processFile'] = ({ file }) =>
       //@ts-ignore
       Promise.reject(forcedError);

    renderHook(() =>
      useUploadFiles({ ...props, isResumable: true,
                       processFile, files: [mockQueuedFile], })
    );

    await waitFor(() => {
      expect(mockOnProcessFileError).toHaveBeenCalledWith(
         { error: forcedError, file: mockQueuedFile.file, key: mockQueuedFile.key,
           useAccelerateEndpoint: undefined }
      );
    });

    await waitFor(() => { expect(mockRemoveUpload).toHaveBeenCalled(); });
  });

  it('should remove upload after processFile promise throws',
     async () =>
  {
    const error = new Error('forced test error');
    const processFile: FileUploaderProps['processFile'] = () => { throw error; };

    renderHook(() =>
      useUploadFiles({ ...props, isResumable: true,
                       processFile, files: [mockQueuedFile],
                     })
    );

    await waitFor(() => {
      expect(mockOnProcessFileError).toHaveBeenCalledWith(
        { error: error, file: mockQueuedFile.file, key: mockQueuedFile.key,
          useAccelerateEndpoint: undefined }
      );
    });

    await waitFor(() => {
      expect(mockRemoveUpload).toHaveBeenCalled();
    });
  });

  it('prepends valid provided `path` to `processedKey`', async () =>
  {
    const path = 'test-path/';
    renderHook(() =>
      useUploadFiles({
        ...props,
        isResumable: true,
        files: [mockQueuedFile],
        path,
      })
    );
    const expected = { key: `${path}${mockQueuedFile.key}` };
    //const startExpected = { key: `${path}${mockQueuedFile.key}` };
    //const uploadExpected = { path: `${path}${mockQueuedFile.key}` };

    await waitFor(() => {
      //expect(mockOnUploadStart).toHaveBeenCalledWith(startExpected);
      expect(mockOnUploadStart).toHaveBeenCalledWith(expected);
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(uploadDataSpy).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      //expect(uploadDataSpy).toHaveBeenCalledWith(expect.objectContaining(uploadExpected));
      expect(uploadDataSpy).toHaveBeenCalledWith(expect.objectContaining(expected));
    });
  });
});

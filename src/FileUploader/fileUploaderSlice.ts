import {createSlice, PayloadAction} from "@reduxjs/toolkit";
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


const initialFileQueue = {
    files: [],
    status: FileStatus.QUEUED,
} as UseFileUploaderState;

const fileUploaderSlice = createSlice({
    name: 'fileUploader',
    initialState: initialFileQueue,
    reducers: {
        addFiles: (state, action: PayloadAction<AddFilesAction>) =>
        {
           const { files, status } = action.payload;

           const newUploads: StorageFiles = files.map((file) => {
              const errorText = action.payload.getFileErrorMessage(file);
              return { // make sure id is unique,
                 // we only use it internally and don't send it to Storage
                 id: `${Date.now()}-${file.name}`,
                 file,
                 error: errorText,
                 key: file.name,
                 status: errorText ? FileStatus.ERROR : status,
                 isImage: file.type.startsWith('image/'),
                 progress: -1,
              };
           });

           const newFiles: StorageFiles = [...state.files, ...newUploads];

           //return { ...state, files: newFiles };
           return { files: newFiles, status: status };
        },
        clearFiles: (state) =>
        { return initialFileQueue },
        queueFiles: (state) =>
        {
           const { files } = state;

           const newFiles = files.reduce<StorageFiles>(
              (files, currentFile) => [
                ...files,
                {
                   ...currentFile,
                   ...(currentFile.status === FileStatus.ADDED ?
                                 { status: FileStatus.QUEUED } : {}),
                },
             ],
             []
           );

           return { files: newFiles };
        },
        removeUpload: (state, action: PayloadAction<RemoveUploadAction>) =>
        {
           const { id } = action.payload;
           const { files } = state;

           const newFiles = files.reduce<StorageFiles>((files, currentFile) => {
             // remove by not returning currentFile
             return currentFile.id === id ? [...files] : [...files, currentFile];
           }, []);

           return { files: newFiles };
        },
        setStatus: (state, action: PayloadAction<SetStatusAction>) =>
        {
           const { id, status } = action.payload;
           const files = updateFiles(state.files, { id, status });

           return { files: files };
        },
        setStatusUploaded: (state,
                            action: PayloadAction<SetStatusUploadedAction>) =>
        {
           const files = updateFiles(state.files, action.payload);
           return { files };
        },
        setStatusUploading: (state, action: PayloadAction<SetStatusUploadingAction>) =>
        {
           const { id, uploadTask } = action.payload;
           const status = FileStatus.UPLOADING;
           const progress = 0;
           const nextFileData = { status, progress, id, uploadTask };

           const files = updateFiles(state.files, nextFileData);

           return { files };
        },
        setUploadProgress: (state,
                            action: PayloadAction<SetUploadProgressAction>) =>
        {
           const { id, progress } = action.payload;
           const files = updateFiles(state.files, { id, progress });

           return { files };
        },
    }
});

export const {
  actions: fileUploaderActions,
  reducer: fileUploaderReducer,
} = fileUploaderSlice;

export default fileUploaderSlice;


const updateFiles = (files: StorageFiles,
                     nextFileData: Pick<StorageFile, 'id'> & Partial<StorageFile>
) =>
   files.reduce<StorageFiles>((files, currentFile) => {
      if (currentFile.id === nextFileData.id)
      { return [...files, {...currentFile, ...nextFileData}]; }
      return [...files, currentFile];
   }, []);
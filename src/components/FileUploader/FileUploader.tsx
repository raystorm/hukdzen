import * as React from 'react';

import { getLogger, ComponentClassName } from '@aws-amplify/ui';
import { VisuallyHidden } from '@aws-amplify/ui-react';
import { useDropZone } from '@aws-amplify/ui-react-core';

import { useFileUploader } from './hooks/useFileUploader/useFileUploader';
import { useUploadFiles } from './hooks/useUploadFiles/useUploadFiles';
import {
  FileStatus,
  FileUploaderProps,
  FileUploaderPathProps,
  FileUploaderHandle,
} from './types';
import { Container } from './ui/Container';
import { DropZone } from './ui/DropZone';
import { FileList } from './ui/FileList';
import { FileListHeader } from './ui/FileListHeader';
import { FileListFooter } from './ui/FileListFooter';
import { FilePicker } from './ui/FilePicker';
import { checkMaxFileSize } from './utils/checkMaxFileSize';
import { defaultFileUploaderDisplayText } from './utils/displayText';
import { filterAllowedFiles } from './utils/filterAllowedFiles';
import { TaskHandler, } from './utils/uploadFile';

const logger = getLogger('Storage');

export const MISSING_REQUIRED_PROPS_MESSAGE =
  '`FileUploader` requires a `maxFileCount` prop to be provided.';
export const ACCESS_LEVEL_WITH_PATH_CALLBACK_MESSAGE =
  '`FileUploader` does not allow usage of a `path` callback prop with an `accessLevel` prop.';
export const ACCESS_LEVEL_DEPRECATION_MESSAGE =
  '`accessLevel` has been deprecated and will be removed in a future major version. See migration notes at https://ui.docs.amplify.aws/react/connected-components/storage/FileUploader';

const FileUploaderBase = React.forwardRef(function FileUploader(
  {
    acceptedFileTypes = [],
    accessLevel,
    autoUpload = true,
    components,
    defaultFiles,
    displayText: overrideDisplayText,
    isResumable = false,
    maxFileCount,
    maxFileSize,
    onFileRemove,
    onUploadError,
    onUploadStart,
    onUploadSuccess,
    path,
    processFile,
    onProcessFileError,
    showThumbnails = true,
    useAccelerateEndpoint,
  }: FileUploaderPathProps | FileUploaderProps,
  ref: React.ForwardedRef<FileUploaderHandle>
): JSX.Element {
  // eslint-disable-next-line no-console
  if (!maxFileCount) { console.warn(MISSING_REQUIRED_PROPS_MESSAGE); }

  if (accessLevel && typeof path === 'function')
  { throw new Error(ACCESS_LEVEL_WITH_PATH_CALLBACK_MESSAGE); }

  const Components = { Container, DropZone, FileList, FilePicker, FileListHeader,
                       FileListFooter, ...components, };

  const allowMultipleFiles =
    maxFileCount === undefined ||
    (typeof maxFileCount === 'number' && maxFileCount > 1);

  const displayText = { ...defaultFileUploaderDisplayText, ...overrideDisplayText, };

  const { getFileSizeErrorText } = displayText;

  const getMaxFileSizeErrorMessage = (file: File): string => {
    return checkMaxFileSize({file, maxFileSize, getFileSizeErrorText,});
  };

  const {
    addFiles,
    clearFiles,
    files,
    removeUpload,
    queueFiles,
    setUploadingFile,
    setUploadPaused,
    setUploadProgress,
    setUploadSuccess,
    setUploadResumed,
  } = useFileUploader(defaultFiles);

  React.useImperativeHandle(ref, () => ({ clearFiles }));

  const { dragState, ...dropZoneProps } = useDropZone({
    acceptedFileTypes,
    onDropComplete: ({ acceptedFiles, rejectedFiles }) => {
      if (rejectedFiles && rejectedFiles.length > 0)
      { logger.warn('Rejected files: ', rejectedFiles); }
      // We need to filter out files by extension here,
      // we don't get filenames on the drag event, only on drop
      const _acceptedFiles = filterAllowedFiles(acceptedFiles, acceptedFileTypes);
      addFiles({
        files: _acceptedFiles,
        status: autoUpload ? FileStatus.QUEUED : FileStatus.ADDED,
        getFileErrorMessage: getMaxFileSizeErrorMessage,
      });
    },
  });

  useUploadFiles({
    accessLevel,
    files,
    isResumable,
    maxFileCount,
    path,
    onUploadError,
    onUploadSuccess,
    onUploadStart,
    setUploadingFile,
    setUploadProgress,
    setUploadSuccess,
    removeUpload,
    processFile,
    onProcessFileError,
    useAccelerateEndpoint,
  });

  const onFilePickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || files.length === 0) { return; }

    addFiles({
      files: Array.from(files),
      status: autoUpload ? FileStatus.QUEUED : FileStatus.ADDED,
      getFileErrorMessage: getMaxFileSizeErrorMessage,
    });
  };

  const onClearAll = () => { clearFiles(); };

  const onUploadAll = () => { queueFiles(); };

  const onPauseUpload: TaskHandler = ({ id, uploadTask }) => {
    uploadTask.pause();
    setUploadPaused({ id });
  };

  const onResumeUpload: TaskHandler = ({ id, uploadTask }) => {
    uploadTask.resume();
    setUploadResumed({ id });
  };

  const onCancelUpload: TaskHandler = ({ id, uploadTask }) => {
    // At this time we don't know if the delete
    // permissions are enabled (required to cancel upload),
    // so we do a pause instead and remove from files
    uploadTask.pause();
    removeUpload({ id });
  };

  const onDeleteUpload = ({ id }: { id: string }) => {
    // At this time we don't know if the delete
    // permissions are enabled, so we do a soft delete
    // from file list, but don't remove from storage
    removeUpload({ id });
    if (typeof onFileRemove === 'function') {
      const file = files.find((file) => file.id === id);
      if (file) {
        const key = file.resolvedKey ?? file.key;
        onFileRemove({ key });
      }
    }
  };

  // checks if all downloads completed to 100%
  const allUploadsSuccessful =
    files.length === 0 ?
    false : files.every((file) => file?.status === FileStatus.UPLOADED);

  // Displays if over max files
  const hasMaxFilesError =
    files.filter((file) => file.progress < 100).length > maxFileCount;

  const uploadedFilesLength = files.filter(
    (file) => file?.status === FileStatus.UPLOADED
  ).length;

  const remainingFilesCount = files.length - uploadedFilesLength;

  // number of files selected for upload when autoUpload is turned off
  const selectedFilesCount = autoUpload ? 0 : remainingFilesCount;

  const hasFiles = files.length > 0;

  const hasUploadActions = !autoUpload && remainingFilesCount > 0;

  const hiddenInput = React.useRef<HTMLInputElement>(null);
  function handleClick() {
    if (hiddenInput.current) {
      hiddenInput.current.click();
      hiddenInput.current.value = '';
    }
  }

  return (
    <Components.Container
      className={`${ComponentClassName.FileUploader} ${
        hasFiles ? ComponentClassName.FileUploaderPreviewer : ''
      }`}
    >
      <Components.DropZone inDropZone={dragState !== 'inactive'}
                           {...dropZoneProps}
                           displayText={displayText}
      >
        <>
          <Components.FilePicker onClick={handleClick}>
            {displayText.browseFilesText}
          </Components.FilePicker>
          <VisuallyHidden>
            <input type="file" tabIndex={-1} ref={hiddenInput}
                   onChange={onFilePickerChange} multiple={allowMultipleFiles}
                   accept={acceptedFileTypes.join(',')}
            />
          </VisuallyHidden>
        </>
      </Components.DropZone>
      {hasFiles ? (
        <Components.FileListHeader
          allUploadsSuccessful={allUploadsSuccessful}
          displayText={displayText}
          fileCount={files.length}
          remainingFilesCount={remainingFilesCount}
          selectedFilesCount={selectedFilesCount}
        />
      ) : null}
      <Components.FileList displayText={displayText} files={files}
                           isResumable={isResumable}
                           onCancelUpload={onCancelUpload}
                           onDeleteUpload={onDeleteUpload}
                           onResume={onResumeUpload}
                           onPause={onPauseUpload}
                           showThumbnails={showThumbnails}
                           hasMaxFilesError={hasMaxFilesError}
                           maxFileCount={maxFileCount}
      />
      {hasUploadActions ? (
        <Components.FileListFooter displayText={displayText}
                                   remainingFilesCount={remainingFilesCount}
                                   onClearAll={onClearAll}
                                   onUploadAll={onUploadAll}
        />
      ) : null}
    </Components.Container>
  );
});

// pass an empty object as first param to avoid destructive action on `FileUploaderBase`
const FileUploader = Object.assign({}, FileUploaderBase, {
  Container, DropZone, FileList, FileListHeader, FileListFooter, FilePicker,
});

export { FileUploader };

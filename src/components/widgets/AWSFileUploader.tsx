import React from 'react';

import { StorageManager } from '@aws-amplify/ui-react-storage';
import '../../Amplify.css';

import { GlobalStyles } from 'tss-react';
import { theme } from "../shared/theme";


export interface AWSFileUploaderProps {
  path: string
  onSuccess(event: { key?: string; }): void;
  onError(error: string, file: {key: string}): void;
}

/**
 * FileUpload component, to submit and upload a file for storage
 * @param props
 * @returns
 */
const AWSFileUploader: React.FC<AWSFileUploaderProps> = (props) =>
{
   const { path, onSuccess, onError } = props

   const onstart = (file: {key?: string}) => {
      alert(`Uploaded Started for ${file.key}`);
   };

   return (
     <>
       <GlobalStyles styles={{
          '.amplify-storagemanager__dropzone__text': {
               fontWeight: 'bold',
               color: theme.palette.text.secondary,
          },
          '.amplify-storagemanager__dropzone': {
             borderStyle: 'solid',
             margin: '.25em',
          },
          '--amplify-components-storagemanager-dropzone-border-style': 'solid',
       }}/>
       <StorageManager
          onUploadSuccess={onSuccess}
          onUploadError={onError}
          onUploadStart={onstart}
          path={path}
          //shouldAutoProceed={true}
          //hasMultipleFiles={false}
          maxFileCount={1}
          /*
            TODO: lock down application to document types ONLY,
                  not executables, or wierd binary types.
           */
          acceptedFileTypes={['image/*', 'application/*', 'text/*',
                              'audio/*', 'video/*']}
          accessLevel="protected"
          displayText={{
             dropFilesText:   'Drag and Drop a File',
             browseFilesText: 'or Click to Browse',
          }}
       />
     </>
   );
};

export default AWSFileUploader;
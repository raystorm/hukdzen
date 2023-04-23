import React from 'react';

import { FileUploader } from '@aws-amplify/ui-react';
import '../../Amplify.css';

import { GlobalStyles } from 'tss-react';
import { theme } from "../shared/theme";


export interface AWSFileUploadProps {
  onSuccess(event: { key: string; }): void;
  onError(error: string): void;
}

/**
 * FileUpload component, to submit and upload a file for storage
 * @param props
 * @returns
 */
const AWSFileUpload: React.FC<AWSFileUploadProps> = (props) =>
{
   const { onSuccess, onError } = props

   return (
     <>
       <GlobalStyles styles={{
          '.fileuploader__dropzone__text': {
               fontWeight: 'bold',
               color: theme.palette.text.secondary,
          },
          '--amplify-components-fileuploader-dropzone-border-style': 'solid',
       }}/>
       <FileUploader
          onSuccess={onSuccess}
          onError={onError}
          shouldAutoProceed={true}
          maxFileCount={1}
          hasMultipleFiles={false}
          /*
            TODO: lock down application to document types ONLY,
                  not executables, or wierd binary types.
           */
          acceptedFileTypes={['image/*', 'application/*', 'text/*',
                              'audio/*', 'video/*']}
          accessLevel="protected"
       />
     </>
   );
};

export default AWSFileUpload;
import React from 'react';

import { ComponentClassNames, Text } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import {ProcessFileParams} from "@aws-amplify/ui-react-storage/dist/types/components/StorageManager/types";
import { IconUpload } from '@aws-amplify/ui-react/internal';

import '../../Amplify.css';
import { GlobalStyles } from 'tss-react';
import { theme } from "../shared/theme";


export interface AWSFileUploaderProps {
  path: string;
  disabled?: boolean;
  disabledText?: string;
  processFile(processFile: ProcessFileParams): Promise<ProcessFileParams> | ProcessFileParams;
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
   const { path, disabled = false, processFile, onSuccess, onError } = props

   const dropFilesText: string = 'Drag and Drop a File';

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
       {
          !!disabled &&
          <div className="amplify-storagemanager__dropzone">
              <IconUpload
                  aria-hidden
                  className={ComponentClassNames.StorageManagerDropZoneIcon}
              />
              <Text className={ComponentClassNames.StorageManagerDropZoneText}>
                {props.disabledText}
              </Text>
          </div>

       }
       { !disabled &&
          <StorageManager
             onUploadSuccess={onSuccess}
             onUploadError={onError}
             path={path}
             processFile={processFile}
             //shouldAutoProceed={true}
             //hasMultipleFiles={false}
             maxFileCount={1}
             /*
               TODO: lock down application to document types ONLY,
                     not executables, or wierd binary types.
             acceptedFileTypes={['image/*', 'application/*', 'text/*',
                                 'audio/*', 'video/*', ]}
             */
             acceptedFileTypes={['*']}
             accessLevel="protected"
             //accessLevel='public'
             displayText={{
                dropFilesText:   dropFilesText,
                browseFilesText: 'or Click to Browse',
             }}
          />
       }
     </>
   );
};

export default AWSFileUploader;
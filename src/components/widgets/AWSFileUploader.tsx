import React, {useEffect} from 'react';

import { ComponentClassNames, Text } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import {ProcessFileParams} from "@aws-amplify/ui-react-storage/dist/types/components/StorageManager/types";
import {StorageAccessLevel} from "@aws-amplify/storage";
import { IconUpload } from '@aws-amplify/ui-react/internal';

import '../../Amplify.css';
import { GlobalStyles } from 'tss-react';
import { theme } from "../shared/theme";
import {useAppSelector} from "../../app/hooks";

export interface AWSFileUploaderProps {
  path: string;
  disabled?: boolean;
  disabledText?: string;
  processFile(processFile: ProcessFileParams): Promise<ProcessFileParams> | ProcessFileParams;
  onSuccess(event: { key?: string; }): void;
  onError(error: string, file: {key: string}): void;
}

//TODO: move this to a shared constants file
/** Content Item Access Level in S3 for Uploaded Files */
//export const UploadAccessLevel = { level: 'protected' as StorageAccessLevel, }
export const UploadAccessLevel = { level: 'public' as StorageAccessLevel, };

/** Display text for File Upload DropZone */
export const dropFilesText: string = 'Drag and Drop a File';

/** Display text for File Upload Button */
export const browseFilesText: string = 'or Click to Browse';

/**
 * FileUpload component, to submit and upload a file for storage
 * @param props
 * @returns
 */
const AWSFileUploader: React.FC<AWSFileUploaderProps> = (props) =>
{
   const { path, disabled = false, processFile, onSuccess, onError } = props
   const document = useAppSelector(state => state.document);
   const ref =  React.useRef(null);

   useEffect(() =>
   {  //@ts-ignore
      if (ref.current) { ref.current.clearFiles(); }
   },
   [document]);

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
          disabled &&
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
             data-testid='awsFileUploader'
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
             accessLevel={UploadAccessLevel.level}
             displayText={{
                dropFilesText:   dropFilesText,
                browseFilesText: browseFilesText,
             }}
             ref={ref} //enables file clearing
          />
       }
     </>
   );
};

export default AWSFileUploader;
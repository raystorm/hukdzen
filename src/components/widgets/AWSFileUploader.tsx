import React, {Ref, useEffect} from 'react';
import {useDispatch} from "react-redux";
import { GlobalStyles } from 'tss-react';

import { /*ComponentClassNames,*/ Text } from '@aws-amplify/ui-react';
import { StorageAccessLevel } from "@aws-amplify/core";
import { ComponentClassName } from "@aws-amplify/ui";
import { IconUpload } from '@aws-amplify/ui-react/internal';

import { FileUploader } from "../FileUploader/FileUploader";
import { ProcessFileParams, FileUploaderHandle } from "../FileUploader/types";


import {useAppDispatch, useAppSelector} from "../../app/hooks";
import '../../Amplify.css';
import { theme } from "../shared/theme";
import DocumentDetails from "../forms/DocumentDetails";

export interface AWSFileUploaderProps {
  path: string;
  disabled?: boolean;
  disabledText?: string;
  error? : string;
  processFile(processFile: ProcessFileParams): Promise<ProcessFileParams> | ProcessFileParams;
  onSuccess(event: { key?: string; }): void;
  onError(error: string, file: {key: string}): void;
}

//TODO: move this to a shared constants file
/** Content Item Access Level in S3 for Uploaded Files */
//export const UploadAccessLevel = { level: 'protected' as StorageAccessLevel, }
export const UploadAccessLevel = { accessLevel: 'public' as StorageAccessLevel, };

/** Display text for File Upload DropZone */
export const dropFilesText: string = 'Drag and Drop a File';

/** Display text for File Upload Button */
export const browseFilesText: string = 'or Click to Browse';

let ref: Ref<FileUploaderHandle> = null;

/*
export const uploadFile = (file: File) => {
   if (ref && ref.current) { ref.current.uploadFile(file); }
}
*/

export const clearFiles = () => {
   //@ts-ignore
   if (ref && ref.current) { ref.current.clearFiles(); }
}

/**
 * FileUpload component, to submit and upload a file for storage
 * @param props
 * @returns
 */
const AWSFileUploader: React.FC<AWSFileUploaderProps> = (props) =>
{
   const { path, disabled = false, error, //ref,
           processFile, onSuccess, onError } = props
   const dispatch = useDispatch();
   const doc = useAppSelector(state => state.document);

   ref = React.useRef<FileUploaderHandle>(null);

   // doc.id is a shortcut to tell if the document has changed or not.
   /*
   useEffect(() =>
   {
      //console.log(doc.id);
      if (ref && ref.current) { ref.current.clearFiles(); }
   },[doc.id, ref]);
   */

   /*
   //listen for setDocument Event,
   // if we have [ListenerMiddleware]
   // https://redux-toolkit.js.org/api/createListenerMiddleware
   //@ts-ignore
   useEffect(() => {
      const clearFiles = () =>
      {
         //@ts-ignore
         if (ref && ref.current) { ref.current.clearFiles(); }
      };

      return dispatch(addListener({
         actionCreator: documentActions.setDocument,
         effect: clearFiles,
      }));
   }, [dispatch, ref]);
   */

   const borderColor: string = error ? '#AA0000' : 'rgba(0, 0, 0, 0.26)';
   const textColor: string = error ? '#AA0000' : theme.palette.text.secondary;

   return (
     <>
       <GlobalStyles styles={{
          '.amplify-fileuploader__dropzone__text': {
               fontWeight: 'bold',
               color: textColor,
          },
          'div.amplify-fileuploader__dropzone': {
             borderStyle: 'solid',
             borderColor: borderColor,
             margin: '.25em',
          },
          '--amplify-components-fileuploader-dropzone-border-style': 'solid',
       }}/>
       {
          disabled &&
          <div className="amplify-fileuploader__dropzone">
              <IconUpload
                  aria-hidden
                  className={ComponentClassName.StorageManagerDropZoneIcon}
              />
              <Text className={ComponentClassName.StorageManagerDropZoneText}>
                {props.disabledText}
              </Text>
          </div>
       }
       { !disabled &&
          <FileUploader
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
                     not executables, or weird binary types.
             acceptedFileTypes={['image/*', 'application/*', 'text/*',
                                 'audio/*', 'video/*', ]}
             */
             acceptedFileTypes={['*']}
             accessLevel={UploadAccessLevel.accessLevel}
             displayText={{
                dropFilesText:   error ? error : dropFilesText,
                browseFilesText: browseFilesText,
             }}
             ref={ref} //enables file clearing
          />
       }
     </>
   );
};

export default AWSFileUploader;
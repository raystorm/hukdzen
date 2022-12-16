import React from 'react';
import Dropzone, 
       { IDropzoneProps, IFileWithMeta, StatusValue } 
       from "react-dropzone-uploader";
import Input from './Input';
import './FileUpload.css';
import { theme } from "../shared/theme";
import * as mime from 'mime-types';

/*
 * TODO: add Props
 *       upload URL
 */

export interface fileUploadProps {
  uploadUrl?: string; //allows override for testing
  whenUploadComplete(file: File): void;
}

//TODO: move to test files later
export const devDoNothingUploadUrl = 'https://httpbin.org/post';

export const defaultUploadUrl = devDoNothingUploadUrl;


const FileUpload: React.FC<fileUploadProps> = (props) => 
{
  const { uploadUrl, whenUploadComplete } = props;
  const uploadToUrl = uploadUrl ? uploadUrl : defaultUploadUrl;

  //TODO: MUI Snackbar
  const message = (msg: string) => { console.log(msg); } //{ alert(msg); }

  //TODO: S3 https://react-dropzone-uploader.js.org/docs/s3 
  //const getUploadParams = ({meta}:IFileWithMeta) => 
  const getUploadParams: IDropzoneProps['getUploadParams'] = () =>
  { return { url: uploadToUrl } }

  const handleChangeStatus: IDropzoneProps['onChangeStatus'] = 
                            ({ meta, file, remove }, status) =>
  {
    setTimeout(() => {}, 1000);
    //console.log(status, meta);
    switch(status)
    {
      case 'ready':
      case 'preparing':
        message(`${meta.name} Preparing for Upload`);
        break;
      case 'started':
      case 'uploading':
      case 'restarted':
        message(`${meta.name} InProgress`);
        break;
      case 'error_file_size':
      case 'error_upload':
      case 'error_upload_params':
      case 'error_validation':
      case 'exception_upload':
      case 'rejected_file_type':
      case 'rejected_max_files':
        message(`${meta.name} ERROR!`);
        //TODO: code to catch and log error
        break;
      case 'done':
        whenUploadComplete(file);
        break;
      case 'headers_received':                
        message(`${meta.name} Upload Complete!`);
        //remove();
    }
    return { meta: { meta } };
  }

  const logStatusChange: IDropzoneProps['onChangeStatus'] = 
                         ({ meta }, status) => 
  { console.log(status, meta, meta.name) }

  const handleSubmit = (files: IFileWithMeta[], allFiles: IFileWithMeta[]) => 
  {
    console.log('files-meta:' + files.map(f => f.meta));
    //message('files-meta:' + files.map(f => f.meta));
    allFiles.forEach(f => f.remove())
    //console.log(files.map(f => 'Uploaded File Type: '+mime.lookup(f.file.name)));
  }

  //
  return (
    <Dropzone
      maxFiles={1} multiple={false}
      inputContent='Drag and Drop a File, or Click to Browse.'
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      //onChangeStatus={logStatusChange}
      //onSubmit={handleSubmit}
      styles={{ inputLabel: { color: theme.palette.text.secondary }, }}
      submitButtonDisabled={true}
      InputComponent={props => <Input {...props}/>}
    />
  )
}

export default FileUpload;
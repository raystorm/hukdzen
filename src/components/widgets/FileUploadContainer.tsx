import Dropzone, 
       { IFileWithMeta, StatusValue } 
       from "react-dropzone-uploader";
import { theme } from "../shared/theme";

/*
 * TODO: add Props
 *       upload URL
 *       
 */



const FileUpload = () => 
{
  //TODO: MUI Snackbar
  const message = (msg: string) => { alert(msg); }

  const getUploadParams = () => 
  {
    //TODO need an upload URL from AWS here
    return { url: 'https://httpbin.org/post' }
  }

  const handleChangeStatus = ({ meta, remove }: IFileWithMeta, 
                              status: StatusValue) => 
  {
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
      case 'headers_received':                
        message(`${meta.name} Upload Complete!`);
        remove();
    }
  }

  const handleSubmit = (files: IFileWithMeta[], allFiles: IFileWithMeta[]) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  //
  return (
    <Dropzone
      maxFiles={1} multiple={false}
      inputContent='Drag and Drop a File, or Click to Browse.'
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      //onSubmit={handleSubmit}
      styles={{
        inputLabel: { color: theme.palette.text.secondary },
      }}
    />
  )
}

export default FileUpload;
import { connect, useDispatch } from 'react-redux'
import React, { ReactComponentElement, useEffect, useState } from 'react'
import { ReactComponent } from 'tss-react/tools/ReactComponent';
import { DocumentDetails, LangFields } from '../../documents/DocumentTypes';
import { FieldDefinition, DocumentDetailsFieldDefintion } from '../../types/fieldDefitions';
import { Button, TextField, TextFieldProps, Tooltip, Typography } from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { DateTimePicker } from '@mui/x-date-pickers';
import { documentActions } from '../../documents/documentSlice';


interface DetailProps extends DocumentDetails {
   pageTitle: string;
   editable?: boolean;
};

const DocumentDetailsForm: React.FC<DetailProps> = (detailProps) =>
{
  const { pageTitle, editable = false, ...details } = detailProps;

  const dispatch = useDispatch();

  //field descscriptions and defintions
  const fieldDefs = DocumentDetailsFieldDefintion;

  /*
   * State for the FORM. (DocumentDetails)
   */

  const [title,    setTitle] = useState(detailProps.title);
  const [desc,     setDesc] = useState(detailProps.description);
  //----
  const [authorId, setAuthor] = useState(detailProps.authorId);
  const [ownerId,  setOwner] = useState(detailProps.ownerId);
  //--
  const [created,  setCreated] = useState(detailProps.created);
  const [updated,  setUpdated] = useState(detailProps.updated);
  //--
  const [type,     setType] = useState(detailProps.type);
  const [version,  setVersion] = useState(detailProps.version);
  //--
  const [nahawtBC, setNahawtBC] = useState(detailProps.bc.title);
  const [magonBC,  setMagonBC] = useState(detailProps.bc.description);
  //--
  const [nahawtAK, setNahawtAK] = useState(detailProps.ak.title);
  const [magonAK,  setMagonAK] = useState(detailProps.ak.description);



  const hidden = (name: string, label: string, value: string) => {
    return <TextField name={name} value={value} label={label} type='hidden' 
                      style={{display:'none'}} />
  }
  
  const input = (name: string, label: string, value: any, title?: string) => {
    return (
      <Tooltip title={title}>
           <TextField name={name} value={value} label={label}
                      onChange={(e) => {}} />
      </Tooltip>);
  }

  const textarea = (name: string, label: string, value: any, title?:string) => {
    return (
      <Tooltip title={title}>
           <TextField name={name} label={label} value={value}
                      multiline minRows='10' />
      </Tooltip>);
  }

  const displayLangFields = (fields: LangFields) => 
  {
    return (<> {
    Object.entries(fields).map(([key, docField]) =>
    {
      switch(key)
      {
        case 'description':          
        return textarea(docField.name, docField.label, docField.value,
                        docField.description);
        case 'title':
          default:
            return input(docField.name, docField.label, docField.value,
                         docField.description);
          }
    })
    }</>)
  }

  const handleOnSubmit = () => {
    if ( !editable ) { return; }
    dispatch(documentActions.updateDocumentMetadata(detailProps));
  }

  return (
      <div>
        <h2 style={{textAlign: 'center'}}>{pageTitle}</h2>
        {
          /* TODO: 
           *   flesh out form props
           *   Improve Form layout   
           *   Embedd Document/image
           * 
           *   Skip FilePath in form (make a link instead.)
           */
        }
        <form contentEditable={editable} >
           <TextField name={fieldDefs.id.name} label={fieldDefs.id.label}
                      value={detailProps.id} 
                      type='hidden' style={{display:'none'}} />
          {/* Ḵ'amksiwaamx */}
          <div style={{display: 'inline-grid'}}>
            <Tooltip title={fieldDefs.title.description}>
                 <TextField name={fieldDefs.title.name} 
                            label={fieldDefs.title.label}
                            value={detailProps.title} 
                            onChange={(e) => {setTitle(e.target.value)}} />
            </Tooltip>
            <Tooltip title={fieldDefs.description.description}>
                 <TextField name={fieldDefs.description.name} 
                            label={fieldDefs.description.label} 
                            value={detailProps.description}
                            onChange={(e) => setDesc(e.target.value)}
                            multiline minRows='10' />
            </Tooltip>
          </div>
          {/* People //TODO: autocomplete */}
          <div style={{display: 'inline-grid'}}>
          <Tooltip title={fieldDefs.authorId.description}>
              <TextField name={fieldDefs.authorId.name} 
                         label={fieldDefs.authorId.label}
                         value={detailProps.authorId} 
                         onChange={(e) => {setAuthor(e.target.value)}} />
          </Tooltip>
          <Tooltip title={fieldDefs.ownerId.description}>
              <TextField name={fieldDefs.ownerId.name} 
                         label={fieldDefs.ownerId.label}
                         value={detailProps.ownerId} 
                         onChange={(e) => {setOwner(e.target.value)}} />
          </Tooltip>
          </div>
          <div style={{display: 'inline-grid'}}>
          <Typography component='a' href={detailProps.filePath}
                      style={{display: 'inline-grid'}}>
            Download File
          </Typography>
          </div>

          {/* BC */}
          <div style={{display: 'inline-grid'}}>
          <Tooltip title={fieldDefs.bc.title.description}>
              <TextField name={fieldDefs.bc.title.name} 
                         label={fieldDefs.bc.title.label}
                         value={detailProps.bc.title} 
                         onChange={(e) => {setNahawtBC(e.target.value)}} />
          </Tooltip>
          <Tooltip title={fieldDefs.bc.description.description}>
           <TextField name={fieldDefs.bc.description.name} 
                      label={fieldDefs.bc.description.label} 
                      value={detailProps.bc.description}
                      onChange={(e) => setMagonBC(e.target.value)}
                      multiline minRows='10' />
          </Tooltip>
          </div>
          {/* AK */}
          <div style={{display: 'inline-grid'}}>
          <Tooltip title={fieldDefs.ak.title.description}>
              <TextField name={fieldDefs.ak.title.name} 
                         label={fieldDefs.ak.title.label}
                         value={detailProps.ak.title} 
                         onChange={(e) => {setNahawtAK(e.target.value)}} />
          </Tooltip>
          <Tooltip title={fieldDefs.ak.description.description}>
           <TextField name={fieldDefs.ak.description.name} 
                      label={fieldDefs.ak.description.label} 
                      value={detailProps.ak.description}
                      onChange={(e) => setMagonAK(e.target.value)}
                      multiline minRows='10' />
          </Tooltip>
          </div>
          {/* VERSIONING */}
          <div style={{display: 'inline-grid'}}>
          <Tooltip title={fieldDefs.version.description} >
              <TextField name={fieldDefs.version.name} 
                         label={fieldDefs.version.label}
                         value={detailProps.version}
                         type='number'
                         onChange={(e) => {setTitle(e.target.value)}} />
          </Tooltip>
            <div style={{margin: '5px'}} >
                <DateTimePicker label={fieldDefs.created.label}
                                value={detailProps.created} 
                                renderInput={(tfProps) => <TextField {...tfProps} />} 
                                onChange={(e) => { if(e){setCreated(e)}}}
                />
            </div>
            <div style={{margin: '5px'}} >
                <DateTimePicker label={fieldDefs.updated.label}
                                value={detailProps.updated} 
                                renderInput={(tfProps) => <TextField {...tfProps} />} 
                                onChange={(e) => { if(e){setUpdated(e)}}}
                />
            </div>
          </div>
          {/* Manually add fields here as they get added. */}
          <hr className='sub-break'/>
          <Button variant='contained' onChange={handleOnSubmit} >
            ma̱x (Save)
          </Button>
        </form>
      </div>
    );
};

export default DocumentDetailsForm;

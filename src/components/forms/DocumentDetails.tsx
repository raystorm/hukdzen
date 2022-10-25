import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Dispatch } from '@reduxjs/toolkit';
import { Button, Input, TextField, TextFieldProps, Tooltip, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { DocumentDetails, LangFields } from '../../documents/DocumentTypes';
import { FieldDefinition, DocumentDetailsFieldDefintion } from '../../types/fieldDefitions';
import ReduxStore from '../../app/store';
import { ReduxState } from '../../app/reducers';
import { documentActions } from '../../documents/documentSlice';



interface DetailProps extends DocumentDetails {
   pageTitle: string;
   editable?: boolean;
   isNew?: boolean;
   isVersion?: boolean;   
};

//const DocumentDetailsForm: React.FC<DetailProps> = (detailProps) =>
const DocumentDetailsForm = (detailProps: DetailProps) =>
{
  let { 
    pageTitle, 
    editable, 
    isNew = false,
    isVersion = false,
   } = detailProps;

  const dispatch = useDispatch();

  //field descscriptions and defintions
  const fieldDefs = DocumentDetailsFieldDefintion;

  /*
   * State for the FORM. (DocumentDetails)
   */

  const [id,       setId]    = useState(detailProps.id);
  const [title,    setTitle] = useState(detailProps.title);
  const [desc,     setDesc]  = useState(detailProps.description);
  //----
  const [authorId, setAuthor] = useState(detailProps.authorId);
  const [ownerId,  setOwner]  = useState(detailProps.ownerId);
  //--
  const [created,  setCreated] = useState(detailProps.created);
  const [updated,  setUpdated] = useState(detailProps.updated);
  //--
  const [type,     setType]    = useState(detailProps.type);
  const [version,  setVersion] = useState(detailProps.version);
  //--
  const [nahawtBC, setNahawtBC] = useState(detailProps.bc.title);
  const [magonBC,  setMagonBC]  = useState(detailProps.bc.description);
  //--
  const [nahawtAK, setNahawtAK] = useState(detailProps.ak.title);
  const [magonAK,  setMagonAK]  = useState(detailProps.ak.description);

  useEffect(() => {
    setTitle(detailProps.title);
    setDesc(detailProps.description);

    setAuthor(detailProps.authorId);
    setOwner(detailProps.ownerId);

    setCreated(detailProps.created);
    setUpdated(detailProps.updated);

    setType(detailProps.type);
    setVersion(detailProps.version);

    setNahawtBC(detailProps.bc.title);
    setMagonBC(detailProps.bc.description);

    setNahawtAK(detailProps.ak.title);
    setMagonAK(detailProps.ak.description);
  }, [detailProps])
  

  const handleOnUpdate = () => {
    if ( !editable ) { return; }
    console.log(`[Title] var:${title}  detailProps:${detailProps.title}`);
    dispatch(documentActions.updateDocumentMetadata(detailProps));
  }

  const handleOnUpload = () => {
    if ( !editable ) { return; }
    console.log(`[Id] var:${id}  detailProps:${detailProps.id}`);
    dispatch(documentActions.createDocumentRequested(detailProps));
  }

  let file;
  if ( isVersion || isNew )
  {
    file = <Input type='file' name='filePath' />
  }
  else 
  {
    file = <Typography component='a' href={detailProps.filePath}
                       style={{display: 'inline-grid'}}>
              Download File
           </Typography>
  }

  let buttons;
  if ( isNew )
  {
    buttons = <Button variant='contained' onClick={handleOnUpload} >
              ludahdoo (Upload)
             </Button>
  }
  else if ( editable )
  {
    buttons = <Button variant='contained' onClick={handleOnUpdate} >
                ma̱x (Save)
              </Button>
  }
  else if ( isVersion )
  {
    buttons = <>
              <Button variant='contained' onClick={handleOnUpdate} >
                ma̱x (Save)
              </Button>
              &nbsp;
              <Button variant='contained' onClick={handleOnUpload} >
              TODO: find word for version  (Upload Version)
             </Button>
              </>
              
  }
  else { buttons = <></> }

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
        <form >
           <TextField name={fieldDefs.id.name} label={fieldDefs.id.label}
                      value={id} 
                      type='hidden' style={{display:'none'}} />
          {/* Ḵ'amksiwaamx */}
          <div style={{display: 'inline-grid'}}>
            <Tooltip title={fieldDefs.title.description}>
                 <TextField name={fieldDefs.title.name} 
                            label={fieldDefs.title.label}
                            value={title} 
                            disabled={!editable}
                            onChange={(e) => { setTitle(e.target.value)}} />
            </Tooltip>
            <Tooltip title={fieldDefs.description.description}>
                 <TextField name={fieldDefs.description.name} 
                            label={fieldDefs.description.label} 
                            value={desc}
                            disabled={!editable}
                            onChange={(e) => setDesc(e.target.value)}
                            multiline minRows='10' />
            </Tooltip>
          </div>
          {/* People //TODO: autocomplete */}
          <div style={{display: 'inline-grid'}}>
          <Tooltip title={fieldDefs.authorId.description}>
              <TextField name={fieldDefs.authorId.name} 
                         label={fieldDefs.authorId.label}
                         value={authorId} 
                         disabled
                         onChange={(e) => {setAuthor(e.target.value)}} />
          </Tooltip>
          <Tooltip title={fieldDefs.ownerId.description}>
              {/* TODO: AutoComplete */}
              <TextField name={fieldDefs.ownerId.name}
                         label={fieldDefs.ownerId.label}
                         value={ownerId}
                         disabled={!editable}
                         onChange={(e) => {setOwner(e.target.value)}} />
          </Tooltip>
          </div>
          <div style={{display: 'inline-grid'}}>
               {file}
          </div>
          {/* BC */}
          <div style={{display: 'inline-grid'}}>
          <Tooltip title={fieldDefs.bc.title.description}>
              <TextField name={fieldDefs.bc.title.name} 
                         label={fieldDefs.bc.title.label}
                         value={nahawtBC}
                         disabled={!editable}
                         onChange={(e) => {setNahawtBC(e.target.value)}} />
          </Tooltip>
          <Tooltip title={fieldDefs.bc.description.description}>
           <TextField name={fieldDefs.bc.description.name} 
                      label={fieldDefs.bc.description.label} 
                      value={magonBC}
                      disabled={!editable}
                      onChange={(e) => setMagonBC(e.target.value)}
                      multiline minRows='10' />
          </Tooltip>
          </div>
          {/* AK */}
          <div style={{display: 'inline-grid'}}>
          <Tooltip title={fieldDefs.ak.title.description}>
              <TextField name={fieldDefs.ak.title.name} 
                         label={fieldDefs.ak.title.label}
                         value={nahawtAK} 
                         disabled={!editable}
                         onChange={(e) => {setNahawtAK(e.target.value)}} />
          </Tooltip>
          <Tooltip title={fieldDefs.ak.description.description}>
           <TextField name={fieldDefs.ak.description.name} 
                      label={fieldDefs.ak.description.label} 
                      value={magonAK}
                      disabled={!editable}
                      onChange={(e) => setMagonAK(e.target.value)}
                      multiline minRows='10' />
          </Tooltip>
          </div>
          {/* VERSIONING */}
          <div style={{display: 'inline-grid'}}>
          <Tooltip title={fieldDefs.version.description} >
              <TextField name={fieldDefs.version.name} 
                         label={fieldDefs.version.label}
                         value={version}
                         disabled={!editable} type='number'
                         onChange={(e) => {setVersion(parseInt(e.target.value))}} />
          </Tooltip>
          <Tooltip title={fieldDefs.type.description}>
                 <TextField disabled
                            name={fieldDefs.type.name} 
                            label={fieldDefs.type.label}
                            value={type} />
            </Tooltip>
            <div style={{margin: '5px'}} >
                <DateTimePicker label={fieldDefs.created.label}
                                value={detailProps.created} 
                                disabled={!editable}
                                renderInput={(tfProps) => <TextField {...tfProps} />} 
                                onChange={(e) => { if(e){setCreated(e)}}}
                />
            </div>
            <div style={{margin: '5px'}} >
                <DateTimePicker label={fieldDefs.updated.label}
                                value={detailProps.updated} 
                                disabled={!editable}
                                renderInput={(tfProps) => <TextField {...tfProps} />} 
                                onChange={(e) => { if(e){setUpdated(e)}}}
                />
            </div>
          </div>
          {/* Manually add fields here as they get added. */}
          <hr className='sub-break'/>
          {/* TODO: logic to only display 1 at a time */}
          {buttons}
        </form>
      </div>
    );
};

/*
const mapStateToProps = (state: ReduxState) => ({
    title: state.document.title
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentDetailsForm);
*/

export default DocumentDetailsForm;

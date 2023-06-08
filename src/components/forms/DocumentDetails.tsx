import React, { Component, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
   Button, Input, MenuItem,
   TextField, TextFieldProps,
   Tooltip, Typography, Link
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';

import { API, Storage } from 'aws-amplify';
import { GraphQLQuery } from '@aws-amplify/api';
import {ProcessFileParams} from "@aws-amplify/ui-react-storage/dist/types/components/StorageManager/types";

//import * as mime from 'mime-types';
//import * as mime from 'mime';
//import * as types from 'mime-types';

import FileUpload from '../widgets/FileUpload';
import AWSFileUpload from '../widgets/AWSFileUpload';
import AWSFileUploader from '../widgets/AWSFileUploader';

import {ListXbiisQuery, GetXbiisQuery, Gyet} from '../../types/AmplifyTypes';
import {emptyXbiis, initialXbiis, Xbiis} from "../../Box/boxTypes";
import { listXbiis } from "../../graphql/queries";
import * as queries from '../../graphql/queries';

import { DocumentDetails, /*LangFields*/ } from '../../docs/DocumentTypes';
import { FieldDefinition, DocumentDetailsFieldDefinition } from '../../types/fieldDefitions';
import { documentActions } from '../../docs/documentSlice';
import { ClanType, getClanFromName } from "../../Gyet/ClanType";
import { printGyet } from "../../Gyet/GyetType";
import {useAppSelector} from "../../app/hooks";
import { boxListActions } from '../../Box/BoxList/BoxListSlice';
import AuthorInput from "../widgets/AuthorInput";


export interface DetailProps extends DocumentDetails {
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

   const boxList = useAppSelector(state => state.boxList);
   const user = useAppSelector(state => state.currentUser);

   useEffect(() => {
     dispatch(boxListActions.getAllBoxes(undefined));
   }, []);

   //field descscriptions and defintions
   const fieldDefs = DocumentDetailsFieldDefinition;

   /*
    * State for the FORM. (DocumentDetails)
    */

   const [id,       setId]    = useState(detailProps.id);
   const [title,    setTitle] = useState(detailProps.eng_title);
   const [desc,     setDesc]  = useState(detailProps.eng_description);
   //----
   const [author,    setAuthor] = useState(detailProps.author);
   const [docOwner,  setOwner ] = useState(detailProps.docOwner);
   //--
   const [created,  setCreated] = useState(detailProps.created);
   const [updated,  setUpdated] = useState(detailProps.updated);
   //--
   //const [filePath, setFilePath]= useState(detailProps.filePath);
   const [fileKey,     setFileKey ] = useState(detailProps.fileKey);
   const [type,     setType]    = useState(detailProps.type);
   const [version,  setVersion] = useState(detailProps.version);
   //--
   const [nahawtBC, setNahawtBC] = useState(detailProps.bc_title);
   const [magonBC,  setMagonBC]  = useState(detailProps.bc_description);
   //--
   const [nahawtAK, setNahawtAK] = useState(detailProps.ak_title);
   const [magonAK,  setMagonAK]  = useState(detailProps.ak_description);

   const [box, setBox] = useState(detailProps.box);

   useEffect(() => {
     setId(detailProps.id);
 
     setTitle(detailProps.eng_title);
     setDesc(detailProps.eng_description);

     setAuthor(detailProps.author);
     setOwner(detailProps.docOwner);

     setCreated(detailProps.created);
     setUpdated(detailProps.updated);

     setBox(detailProps.box);

     setFileKey(`${detailProps.fileKey}`)
     setType(`${detailProps.type}`);
     setVersion(detailProps.version);

     setNahawtBC(detailProps.bc_title);
     setMagonBC(detailProps.bc_description);

     setNahawtAK(detailProps.ak_title);
     setMagonAK(detailProps.ak_description);

     // generate temp download URL (move to onclick link action)
     // Storage.get(detailProps.fileKey, { level: 'protected', })
     //        .then(value => { setDownloadURL(value); });

   }, [detailProps]);

   const buildDocFromForm = (): DocumentDetails => {
     return {
        __typename: "DocumentDetails",
        id: id,

        eng_title: title,
        eng_description: desc,

        author: author,
        documentDetailsAuthorId: author.id,
        docOwner: docOwner,
        documentDetailsDocOwnerId: docOwner.id,

        fileKey: fileKey,
        created: created,
        updated: updated,
        type:    type,
        version: version,

        box: box,
        documentDetailsBoxId: box.id,

        bc_title:       nahawtBC,
        bc_description: magonBC,

        ak_title:       nahawtAK,
        ak_description: magonAK,

        createdAt: detailProps.createdAt,
        updatedAt: new Date().toISOString(),
     }
   }

   const [versionError, setVersionError] = useState('');

   const handleVersionChange = 
         (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
   {
      const nextVersion = Number(e.target.value);

      if ( detailProps.version <= nextVersion ) 
      { 
         setVersion(nextVersion);
         setVersionError(''); //ensure any previous error is cleared
      }
      else { setVersionError('version can only go UP.'); }
   }

   const handleBoxChange = (json: string) =>
   {
      const bx: Xbiis = JSON.parse(json);
      setBox(bx);
   }

   const handleOnUpdate = () => 
   {
      if ( !editable ) { return; }
      console.log(`[Title] var:${title} original:${detailProps.eng_title}`);
      const newDoc = buildDocFromForm();
      dispatch(documentActions.updateDocumentMetadata(newDoc));
   }

   const handleOnCreateNewVersion = () => 
   {
      if ( !editable || !fileKey ) { return; }
      console.log(`[Id] var:${id} original:${detailProps.id}`);
      const newDoc = buildDocFromForm();
      dispatch(documentActions.updateDocumentVersion(newDoc));
   }

   const handleOnNewDocument = () => 
   {
      if ( !editable ) { return; }
      console.log(`[Id] var:${id} original:${detailProps.id}`);
      const newDoc = buildDocFromForm();
      dispatch(documentActions.createDocumentRequested(newDoc));
   }

   const preUploadProcessor = (processFile: ProcessFileParams) =>
   {
      setType(processFile.file.type);
      console.log(`setting fileType Pre-Upload: ${processFile.file.type}`);

      return processFile;
   };

   const onUploadSuccess = (event: {key: string}) =>
   {
      //set FileKey as a backup, to AWS URL
      setFileKey(event.key);

      /* Backup type setting if getting type from the browser fails.
      const lookup = (filename : string ) =>
      {
         const ext = filename.split('.').pop();
         return (ext ? types.types[ext] : null);
      }

      //set Content Type for the file.
      setType(lookup(event.key));
      // end backup type setting */

      //increment version
      if ( !isNew ) { setVersion(version+1); }
      else { setVersion(1); }
   }

   const onUploadError = (error: string) => {
      //TODO: handle this better
      console.log(error);
   }

   const handleOnDownloadClick = () =>
   {
      if ( !fileKey ) { return; } //no key, bail
      Storage.get(fileKey, { level: 'protected', })
             .then(value => { window.open(value); });
             //{ navigate(value); });
   }

   let file: JSX.Element;
   if ( isVersion || isNew )
   {
      file = <AWSFileUploader
                //path={user.id+'/'}
                path={box?.id+'/'}
                disabled={box?.id == emptyXbiis.id}
                disabledText= 'Disabled Until a Box is Selected'
                processFile={preUploadProcessor}
                onSuccess={onUploadSuccess}
                onError={onUploadError} />;
   }
   else { file = <></>; }

   let buttons;
   if ( isNew )
   {
      buttons = <Button variant='contained' onClick={handleOnNewDocument} >
                  Ma̱ngyen (Upload(Create New Item))
                </Button>
   }
   else if ( isVersion )
   {
      buttons = <>
                  <Button variant='contained' onClick={handleOnUpdate} >
                    ma̱x (Save)
                  </Button>
                  &nbsp;
                  <Button variant='contained' onClick={handleOnCreateNewVersion} >
                    Ma̱ngyen aamadzap (Upload better Version)
                  </Button>
                </>
   }
   else if ( editable )
   {
      buttons = <Button variant='contained' onClick={handleOnUpdate} >
                  ma̱x (Save)
                </Button>
   }
   else { buttons = <></> }

   return (
      <div>
        <h2 style={{textAlign: 'center'}}>{pageTitle}</h2>
        {
          /* TODO: 
           *   flesh out form props
           *   Improve Form layout   
           *   Embed Document/image
           */
        }
        <form >
           <TextField name={fieldDefs.id.name} label={fieldDefs.id.label}
                      value={id} data-testid={fieldDefs.id.name}
                      type='hidden' style={{display:'none'}} />
          {/* Ḵ'amksiwaamx */}
          <div style={{display: 'inline-grid'}}>
            <Tooltip title={fieldDefs.eng_title.description}>
                 <TextField name={fieldDefs.eng_title.name}
                            label={fieldDefs.eng_title.label}
                            value={title} 
                            disabled={!editable}
                            onChange={(e) => { setTitle(e.target.value)}} />
            </Tooltip>
            <Tooltip title={fieldDefs.eng_description.description}>
                 <TextField name={fieldDefs.eng_description.name}
                            label={fieldDefs.eng_description.label}
                            value={desc}
                            disabled={!editable}
                            onChange={(e) => setDesc(e.target.value)}
                            multiline minRows='10' />
            </Tooltip>
          </div>
          {/* People //TODO: autocomplete */}
          <div style={{display: 'inline-grid'}}>
             <AuthorInput author={author} setAuthor={setAuthor}
                          tooltip={`${fieldDefs.author.description}`}
                          name={fieldDefs.author.name}
                          label={fieldDefs.author.label} />
             <Tooltip title={fieldDefs.docOwner.description}>
                 {/* TODO: AutoComplete */}
                 <TextField name={fieldDefs.docOwner.name}
                            label={fieldDefs.docOwner.label}
                            value={printGyet(docOwner)}
                            disabled
                            //disabled={!editable}
                            //onChange={(e) => {setOwner(e.target.value)}}
                 />
             </Tooltip>
             <TextField required name='box' data-testid='box' label='Box' select
                        //style={{minWidth: '14.5em'}}
                        value={JSON.stringify(box)}
                        onChange={(e) => handleBoxChange(e.target.value)}
             >
                {/* TODO: Boxes List and MAP */}
                { boxList.items.map((b) => (
                   <MenuItem key={b.id} value={JSON.stringify(b)}>{b.name}</MenuItem>
                ))}
             </TextField>
            {file}
             {/*
             <Typography key='DownloadLabel'
                          //component='a' href={downloadUrl}
                         component='a' onClick={handleOnDownloadClick}
                         style={{display: 'inline-grid'}}>
                Download Current File
             </Typography>
             */}
             <Link component='button' onClick={handleOnDownloadClick}
                   style={{display: 'inline-grid'}}>
                Download Current File
             </Link>
          </div>
          <div style={{display: 'inline-grid'}}>
          </div>
          {/* BC */}
          <div style={{display: 'inline-grid'}}>
          <Tooltip title={fieldDefs.bc_title.description}>
            <TextField name={fieldDefs.bc_title.name}
                       label={fieldDefs.bc_title.label}
                       value={nahawtBC}
                       disabled={!editable}
                       onChange={(e) => {setNahawtBC(e.target.value)}} />
          </Tooltip>
          <Tooltip title={fieldDefs.bc_description.description}>
           <TextField name={fieldDefs.bc_description.name}
                      label={fieldDefs.bc_description.label}
                      value={magonBC}
                      disabled={!editable}
                      onChange={(e) => setMagonBC(e.target.value)}
                      multiline minRows='10' />
          </Tooltip>
          </div>
          {/* AK */}
          <div style={{display: 'inline-grid'}}>
          <Tooltip title={fieldDefs.ak_title.description}>
              <TextField name={fieldDefs.ak_title.name}
                         label={fieldDefs.ak_title.label}
                         value={nahawtAK} 
                         disabled={!editable}
                         onChange={(e) => {setNahawtAK(e.target.value)}} />
          </Tooltip>
          <Tooltip title={fieldDefs.ak_description.description}>
           <TextField name={fieldDefs.ak_description.name}
                      label={fieldDefs.ak_description.label}
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
                         error={versionError !== ''} helperText={versionError}
                         onChange={(e) => {handleVersionChange(e)}} />
            </Tooltip>
            <Tooltip title={fieldDefs.type.description}>
                 <TextField disabled
                            InputLabelProps={{ shrink: true }}
                            name={fieldDefs.type.name}
                            label={fieldDefs.type.label}
                            value={type} />
            </Tooltip>
            </div>
            <div style={{display: 'inline-grid'}}>
            {/* Should users be allowed to set Past Dates for Create?
                To reflect "REAL WORLD" creation times?
                TODO: Add <Tooltip wrapping to RenderInput
              */}
            <DateTimePicker label={fieldDefs.created.label}
                            value={created} 
                            disabled
                            renderInput={(tfProps) => <TextField {...tfProps} />} 
                            onChange={(e) => { if(e){setCreated(e)}}}
            />
            <DateTimePicker label={fieldDefs.updated.label}
                            value={updated} 
                            disabled
                            renderInput={(tfProps) => <TextField {...tfProps} />} 
                            onChange={(e) => { if(e){setUpdated(e)}}}
            />
          </div>
          {/* Manually add fields here as they get added. */}
          <hr className='sub-break'/>
          {/* TODO: logic to only display 1 at a time */}
          {buttons}
        </form>
      </div>
    );
};

export default DocumentDetailsForm;

import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { sha256 } from 'js-sha256';

import { Button, MenuItem, IconButton,
         TextField, Tooltip, Link, CircularProgress,
         InputAdornment,
       } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import TranslateIcon from '@mui/icons-material/Translate';
import TextRotationNoneIcon from '@mui/icons-material/TextRotationNone';

import { getUrl } from '@aws-amplify/storage';

import {ProcessFileErrorParams, ProcessFileParams} from "../FileUploader/types";

import AWSFileUploader, { UploadAccessLevel } from '../widgets/AWSFileUploader';

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useIfDocumentExists from '../hooks/useIfDocumentExists';
import { isDevLocation } from "../shared/location";

import { DocumentDetails } from '../../docs/DocumentTypes';
import { DocumentDetailsFieldDefinition } from '../../types/fieldDefitions';
import { documentActions } from '../../docs/documentSlice';
import { printGyet } from "../../Gyet/GyetType";

import { boxListActions } from '../../Box/BoxList/BoxListSlice';
import {emptyXbiis, printXbiis, Xbiis} from "../../Box/boxTypes";
import AuthorInput from "../widgets/AuthorInput";
import { emptyAuthor } from "../../Author/AuthorType";
import { emptyUser } from "../../User/userType";

import { theme } from "../shared/theme";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";
import { alertBarActions } from "../../AlertBar/AlertBarSlice";
import { useTranslator, TranslationDirection } from '../hooks/useTranslator';

export interface DetailProps {
   doc: DocumentDetails;
   pageTitle: string;
   editable?: boolean;
   isNew?: boolean;
   isVersion?: boolean;
};

const DocumentDetailsForm = (detailProps: DetailProps) =>
{
   let {
     doc,
     pageTitle,
     editable,
     isNew = false,
     isVersion = false,
   } = detailProps;

   const dispatch = useAppDispatch();

   const boxList = useAppSelector(state => state.boxList);
   const user = useAppSelector(state => state.currentUser);
   const { translateField } = useTranslator();

   useEffect(() => {
     if ( isDevLocation() )
     { console.log('Dispatch to get all WritableBoxes for user:', user); }
     if ( !boxList || 0 === boxList.items.length )
     { dispatch(boxListActions.getAllWritableBoxes(user)); }
   }, []); //[] == only run on mount, //[user.id, dispatch]);

   //TODO: Loading Xbiis ?
   /*
   const initBoxOption = doc.box && doc.box.id ?
            [<MenuItem key={doc.box.id} value={doc.box.id}>{printXbiis(doc.box)}</MenuItem>]
            : [<MenuItem key={emptyXbiis.id} value={emptyXbiis.id}>{printXbiis(emptyXbiis)}</MenuItem>] ;

   //const [boxOptions, setBoxOptions] = useState([] as ReactElement[]);
   const [boxOptions, setBoxOptions] = useState(initBoxOption);

   useEffect(() =>
   {
      if ( isDevLocation() ) { console.log('updating boxOptions'); }
      const items: any = boxList.items.map((b) => (
            !!b && <MenuItem key={b.id} value={b.id}>{printXbiis(b)}</MenuItem>
      ));
      setBoxOptions(items);
   }, [boxList]);
   */

   const boxOptions = useMemo(() => {
      //if ( isDevLocation() ) { console.log('updating boxOptions'); }
      return boxList.items.filter(b => !!b).map((b) => (
         <MenuItem key={b.id} value={b.id}>{printXbiis(b)}</MenuItem>
      ));
   }, [boxList.items]);

   //field descriptions and definitions
   const fieldDefs = DocumentDetailsFieldDefinition;

   //const [isProcessing, setIsProcessing] = useState(false);
   const isProcessing = useAppSelector(state => state.ui.isProcessing);

   /*
    * State for the FORM. (DocumentDetails)
    */

   const [id,       setId]    = useState(doc.id);
   const [title,    setTitle] = useState(doc.eng_title);
   const [desc,     setDesc]  = useState(doc.eng_description);
   //----
   const [author,    setAuthor] = useState(doc.author);
   const [docOwner,  setOwner ] = useState(doc.docOwner);
   //--
   const [created,  setCreated] = useState(doc.created);
   const [updated,  setUpdated] = useState(doc.updated);
   //--
   const [fileKey,  setFileKey ] = useState(doc.fileKey);
   const [fileHash, setFileHash ] = useState(doc.fileHash);
   const [type,     setType]     = useState(doc.type);
   const [version,  setVersion]  = useState(doc.version);
   //--
   const [nahawtBC, setNahawtBC] = useState(doc.bc_title);
   const [magonBC,  setMagonBC]  = useState(doc.bc_description);
   //--
   const [nahawtAK, setNahawtAK] = useState(doc.ak_title);
   const [magonAK,  setMagonAK]  = useState(doc.ak_description);

   const [box, setBox] = useState(doc.box);

   const [authorError,  setAuthorError]  = useState('');
   const [ownerError,   setOwnerError]   = useState('');
   const [boxError,     setBoxError]     = useState('');
   const [fileKeyError, setFileKeyError] = useState('');
   const [typeError,    setTypeError]    = useState('');
   const [versionError, setVersionError] = useState('');

   let file: ReactElement;

   useEffect(() => {
     //console.log('setting State from Document Update.');
     setId(doc.id);
 
     setTitle(doc.eng_title);
     setDesc(doc.eng_description);

     setAuthor(doc.author);
     setOwner(doc.docOwner);

     setCreated(doc.created);
     setUpdated(doc.updated);

     setBox(doc.box);

     setFileKey(`${doc.fileKey}`)
     setFileHash(`${doc.fileHash}`)
     setType(`${doc.type}`);
     setVersion(doc.version);

     setNahawtBC(doc.bc_title);
     setMagonBC(doc.bc_description);

     setNahawtAK(doc.ak_title);
     setMagonAK(doc.ak_description);
   }, [doc.id]);

   const clearFormErrors = () => {
      setAuthorError('');
      setOwnerError('');
      setBoxError('');
      setFileKeyError('');
      setTypeError('');
      setVersionError('');
   }

   const validateDocForm = () => {
      const storeFKError = fileKeyError;
      clearFormErrors();
      let isValid = true;

      if ( !author || emptyAuthor === author )
      {
         isValid = false;
         setAuthorError('Author is a Required Field.');
      }
      if ( !docOwner || emptyUser === docOwner )
      {
         isValid = false;
         setOwnerError('Document Owner is a Required Field.');
      }
      if ( !box || emptyXbiis === box )
      {
         isValid = false;
         setBoxError('Box is a Required Field.');
      }
      if ( !fileKey || 0 === fileKey.trim().length || 'null' === fileKey )
      {
         isValid = false;
         setFileKeyError('Need a file to Upload.');
      }
      else if ( storeFKError ) //keep duplicate file error, if sent.
      {
         isValid = false;
         setFileKeyError(storeFKError);
      }
      if ( !type || 'undefined' === type || 'null' === type
        || 0 === type.trim().length )
      {
         isValid = false;
         setTypeError('Missing File, or Unknown File Type.');
      }
      if ( !Number.isFinite(version) || version < 0 )
      {
         isValid = false;
         setVersionError(`Version (${version}) cannot be negative.`);
      }

      return isValid;
   }

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
        fileHash: fileHash,
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

        createdAt: doc.createdAt,
        updatedAt: new Date().toISOString(),
     }
   }

   const preserveState = () => {
      const newDoc = buildDocFromForm();
      dispatch(documentActions.setDocument(newDoc));
   }

   /**
    * Helper function, to wrap isProcessing Checks for the handle* callbacks
    */
   const asyncHandler = useCallback(<T extends any[]>(handle:  (...args: T) => Promise<void>) => {
      //console.log('asyncHandler called');
      return async (...args: T) => {
         if (!editable || isProcessing) { return; }
         try
         {
            //setIsProcessing(true);
            await handle(...args);
         }
         catch (err) { console.error(`Handler error:`, err); }
         //finally { setIsProcessing(false); }
      };
   }, [editable]);

   const handleVersionChange = asyncHandler(
         async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
   {
      const nextVersion = Number(e.target.value);

      if ( doc.version <= nextVersion )
      { 
         setVersion(nextVersion);
         setVersionError(''); //ensure any previous error is cleared
      }
      else { setVersionError('version can only go UP.'); }
   });

   const handleBoxChange = asyncHandler(async (id: string) =>
   {
      let bx : Xbiis | undefined | null = null;
      if ( boxList && boxList.items )
      { bx = boxList.items.find(b => b && b.id === id); }
      if ( bx ) { setBox(bx); }
      else { setBox(emptyXbiis); }
   });

   const checkAndMoveDocument = () =>
   {
      if ( doc.box.id === box.id ) { return fileKey; } // nothing to move

      const fileName = fileKey.substring(fileKey.indexOf('/')+1);
      const newPath = box.id + '/' + fileName;

      dispatch(documentActions.moveDocument({
         source: fileKey,
         destination: newPath,
      }));
      return newPath;
   };

   const handleOnUpdate = asyncHandler(async () =>
   {
      if ( isDevLocation() )
      { console.log(`[Title] var:${title} original:${doc.eng_title}`); }
      if ( !validateDocForm() ) { return; }
      const newDoc = buildDocFromForm();
      newDoc.fileKey = checkAndMoveDocument();
      dispatch(documentActions.updateDocumentMetadata(newDoc));
   });

   const handleOnCreateNewVersion = asyncHandler(async () =>
   {
      if ( !fileKey ) { return; }
      if ( isDevLocation() )
      { console.log(`[Id] var:${id} original:${doc.id}`); }
      if ( !validateDocForm() ) { return; }
      let newDoc = buildDocFromForm();
      newDoc.fileKey = checkAndMoveDocument();
      dispatch(documentActions.updateDocumentVersion(newDoc));
   });

   const handleOnNewDocument = asyncHandler(async () =>
   {
      if ( isDevLocation() )
      { console.log(`[Id] var:${id} original:${doc.id}`); }
      if ( !validateDocForm() ) { return; }
      const newDoc = buildDocFromForm();
      if ( isDevLocation() )
      { console.log(`creating new Document with:\n${JSON.stringify(newDoc, null, 2)}`); }
      dispatch(documentActions.createDocument(newDoc));
   });

   const handleDelete = asyncHandler(async () => {
      dispatch(documentActions.removeDocument(doc))
   });

   const { checkExists, checking } = useIfDocumentExists();
   const [isProcessingPreUpload, setIsProcessingPreUpload] = useState(false);

   const preUploadProcessor = useCallback(async (processFile: ProcessFileParams) =>
   {
      if ( isProcessingPreUpload ) { return processFile; } //already processing, bail
      setIsProcessingPreUpload(true);

      try
      {
         setType(processFile.file.type);
         if ( isDevLocation() )
         { console.log('setting fileType Pre-Upload:', processFile.file.type); }

         /* Doesn't yet work in @aws-amplify/ui-react-storage
          * https://github.com/aws-amplify/amplify-ui/issues/5099
          * imported FileUploader directly, and patch-packaged @aws-amplify/storage with a fix
          */

         if ( !box || emptyXbiis === box )
         { return Promise.reject("Box is Required."); } //reject, if no box
         const expectedFileKey = box.id + '/' + processFile.file.name;

         /**
          *  Helper Method to Generate a file hash (used for duplicate detection)
          *  @param file
          */
         const getFileHash = async (file: File): Promise<string> =>
         { return sha256(await file.bytes()); };

         // Generate content hash for duplicate detection
         const hash = await getFileHash(processFile.file);
         setFileHash(hash);
         console.log('file hashed to:', hash);

         //ensure any previous error is cleared before checking
         setFileKeyError('');

         // custom hook for cleaner logic separation
         const exists = await checkExists(doc.id, box.id, hash, expectedFileKey);
         if ( exists )
         {
            const existsMsg: string = 'File Already Exists in this Box.';
            setFileKeyError(existsMsg);
            throw new Error(existsMsg);
            /*
            const pfe: ProcessFileErrorParams = {
               ...processFile,
               error: existsMsg,
               key: expectedFileKey,
            }
            return Promise.reject(pfe);
            */
         }
         // END - doesn't yet work in Lib. */
         return processFile;
      }
      finally { setIsProcessingPreUpload(false); }
   }, [isProcessingPreUpload, setIsProcessingPreUpload, checkExists, doc.id, box?.id]);

   const onUploadSuccess = useCallback((event: {key: string}) =>
   {  //set FileKey - where to find the file in AWS - S3
      if ( isDevLocation() ) { console.log('new fileKey:', event.key); }
      setFileKey(event.key);

      //increment version
      if ( isNew ) { setVersion(1); }
      else
      {
         const nextVer = version+1;
         //if ( isDev() ) { console.log('incrementing version to:', nextVer); }
         setVersion(nextVer);
      }
   }, [isNew, setVersion]);

   const onUploadError = useCallback((error: string) => {
      //TODO: handle this better
      console.error(error);
   }, []);

   const handleOnDownloadClick = () =>
   {
      if ( !fileKey ) { return; } //no key, bail

      getUrl({key: fileKey, options: UploadAccessLevel})
         .then(value => { window.open(value.url); })
         .catch(err => {
            const errMsg = 'Unexpected Error getting Download file.'
            console.error(errMsg, err);
            dispatch(alertBarActions.DisplayAlertBox(buildErrorAlert(errMsg)));
         });
   }

   const handleTranslate = useCallback((direction: TranslationDirection, fieldType: 'title' | 'description') => {
      const sourceValue = direction === TranslationDirection.BC_TO_AK 
         ? (fieldType === 'title' ? nahawtBC : magonBC)
         : (fieldType === 'title' ? nahawtAK : magonAK);
      const targetValue = direction === TranslationDirection.BC_TO_AK
         ? (fieldType === 'title' ? nahawtAK : magonAK) 
         : (fieldType === 'title' ? nahawtBC : magonBC);
      
      // Check if target already has content
      if (targetValue?.trim()) {
         dispatch(alertBarActions.DisplayAlertBox(
            buildErrorAlert(`Cannot translate: Target ${fieldType} already has content`)
         ));
         return;
      }
      
      const translated = translateField(sourceValue, direction);
      if (translated) {
         if (direction === TranslationDirection.BC_TO_AK) {
            fieldType === 'title' ? setNahawtAK(translated) : setMagonAK(translated);
         } else {
            fieldType === 'title' ? setNahawtBC(translated) : setMagonBC(translated);
         }
      }
   }, [nahawtBC, magonBC, nahawtAK, magonAK, translateField, dispatch]);

   if ( isVersion || isNew )
   {
      file = <AWSFileUploader
                path={box?.id+'/'}
                disabled={box?.id === emptyXbiis.id}
                disabledText='Disabled Until a Box is Selected'
                error={fileKeyError}
                processFile={preUploadProcessor}
                onSuccess={onUploadSuccess}
                onError={onUploadError} />;
   }
   else { file = <></>; }

   let buttons: ReactElement;
   const progressIcon = <CircularProgress size={16} />;
   if ( isNew )
   {
      buttons = <Button variant='contained' disabled={isProcessing}
                        startIcon={isProcessing ? progressIcon : null}
                        onClick={handleOnNewDocument}
                >
                  {isProcessing ? 'Yagwa Ma̱ngyen (Upload(Create New Item))'
                                : 'Ma̱ngyen (Upload(Create New Item))'}
                </Button>
   }
   else if ( isVersion )
   {
      buttons = <>
                  <Button variant='contained' disabled={isProcessing}
                          startIcon={isProcessing ? progressIcon : null}
                          onClick={handleOnUpdate}
                  >
                    {isProcessing ? 'yagwa ma̱x (Saving...)' : 'ma̱x (Save)'}
                  </Button>
                  &nbsp;
                  {/*<Button variant='contained' onClick={handleOnCreateNewVersion} >*/}
                  <Button variant='contained' disabled={isProcessing}
                          startIcon={isProcessing ? progressIcon : null}
                          onClick={handleOnCreateNewVersion}
                  >
                     {isProcessing ? 'Yagwa Ma̱ngyen aamadzap (Uploading better Version)'
                                   : 'Ma̱ngyen aamadzap (Upload better Version)'}
                  </Button>
                  &nbsp;
                  <Button variant='contained' disabled={isProcessing}
                          style={{backgroundColor: theme.palette.secondary.main}}
                          startIcon={isProcessing ? progressIcon : null}
                          onClick={handleDelete}
                  >
                     {isProcessing ? 'Deleting' : 'Delete'}
                  </Button>
                </>
   }
   else if ( editable )
   {
      buttons = <Button variant='contained' disabled={isProcessing}
                        startIcon={isProcessing ? progressIcon : null}
                        onClick={handleOnUpdate} >
                  {isProcessing ? 'yagwa ma̱x (Saving...)' : 'ma̱x (Save)'}
                </Button>
   }
   else { buttons = <></> }

   const translateIcon = <TextRotationNoneIcon />;

   return (
      <div>
        <h2 style={{textAlign: 'center'}}>{pageTitle}</h2>
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
          {/* People */}
          <div style={{display: 'inline-grid'}}>
             <AuthorInput author={author} setAuthor={setAuthor}
                          tooltip={`${fieldDefs.author.description}`}
                          name={fieldDefs.author.name}
                          label={fieldDefs.author.label}
                          error={authorError}
                          preserveState={preserveState} />
             <Tooltip title={fieldDefs.docOwner.description} placement='top'>
                 {/* TODO: AutoComplete */}
                 <TextField name={fieldDefs.docOwner.name}
                            label={fieldDefs.docOwner.label}
                            value={printGyet(docOwner)}
                            error={!!ownerError} helperText={ownerError}
                            disabled
                            //disabled={!editable}
                            //onChange={(e) => {setOwner(e.target.value)}}
                 />
             </Tooltip>
             {/* File */}
             <Tooltip title={fieldDefs.box.description} placement='top'>
               <TextField required data-testid='box' select
                          name={fieldDefs.box.name}
                          label={fieldDefs.box.label}
                          //style={{minWidth: '14.5em'}}
                          error={!!boxError} helperText={boxError}
                          value={box ? box.id : emptyXbiis.id} //{JSON.stringify(box)}
                          onChange={(e) => handleBoxChange(e.target.value)}
               >
                 {boxOptions}
               </TextField>
             </Tooltip>
            {file}
             { fileKey &&
               <Link component='button' onClick={handleOnDownloadClick}
                     style={{display: 'inline-grid'}}>
                 Download Current File
               </Link>
             }
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
                       onChange={(e) => {setNahawtBC(e.target.value)}}
                       InputProps={{
                          endAdornment: (
                             <InputAdornment position="end">
                                <IconButton 
                                   size="small"
                                   disabled={!nahawtBC || !!nahawtAK || !editable}
                                   onClick={() => handleTranslate(TranslationDirection.BC_TO_AK, 'title')}
                                   title="Translate BC to AK"
                                >
                                   {translateIcon}
                                </IconButton>
                             </InputAdornment>
                          )
                       }} />
          </Tooltip>
          <Tooltip title={fieldDefs.bc_description.description}>
           <TextField name={fieldDefs.bc_description.name}
                      label={fieldDefs.bc_description.label}
                      value={magonBC}
                      disabled={!editable}
                      onChange={(e) => setMagonBC(e.target.value)}
                      multiline minRows={10} maxRows={10}
                      InputProps={{
                         endAdornment: (
                            <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                               <IconButton 
                                  size="small"
                                  disabled={!magonBC || !!magonAK || !editable}
                                  onClick={() => handleTranslate(TranslationDirection.BC_TO_AK, 'description')}
                                  title="Translate BC to AK"
                               >
                                  {translateIcon}
                               </IconButton>
                            </InputAdornment>
                         )
                      }} />
          </Tooltip>
          </div>
          {/* AK */}
          <div style={{display: 'inline-grid'}}>
          <Tooltip title={fieldDefs.ak_title.description}>
              <TextField name={fieldDefs.ak_title.name}
                         label={fieldDefs.ak_title.label}
                         value={nahawtAK} 
                         disabled={!editable}
                         onChange={(e) => {setNahawtAK(e.target.value)}}
                         InputProps={{
                            endAdornment: (
                               <InputAdornment position="end">
                                  <IconButton 
                                     size="small"
                                     disabled={!nahawtAK || !!nahawtBC || !editable}
                                     onClick={() => handleTranslate(TranslationDirection.AK_TO_BC, 'title')}
                                     title="Translate AK to BC"
                                  >
                                     {translateIcon}
                                  </IconButton>
                               </InputAdornment>
                            )
                         }} />
          </Tooltip>
          <Tooltip title={fieldDefs.ak_description.description}>
           <TextField name={fieldDefs.ak_description.name}
                      label={fieldDefs.ak_description.label}
                      value={magonAK}
                      disabled={!editable}
                      onChange={(e) => setMagonAK(e.target.value)}
                      multiline minRows={10} maxRows={10}
                      InputProps={{
                         endAdornment: (
                            <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                               <IconButton 
                                  size="small"
                                  disabled={!magonAK || !!magonBC || !editable}
                                  onClick={() => handleTranslate(TranslationDirection.AK_TO_BC, 'description')}
                                  title="Translate AK to BC"
                               >
                                  {translateIcon}
                               </IconButton>
                            </InputAdornment>
                         )
                      }} />
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
                            error={!!typeError} helperText={typeError}
                            value={type} />
            </Tooltip>
            </div>
            <div style={{display: 'inline-grid'}}>
            {/* Should users be allowed to set Past Dates for Create?
                To reflect "REAL WORLD" creation times?
                TODO: Add <Tooltip> wrapping to RenderInput
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

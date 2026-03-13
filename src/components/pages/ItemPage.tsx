import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {matchPath, useLocation, useParams} from 'react-router';
import { getUrl } from '@aws-amplify/storage';
import Box from '@mui/material/Box';
import type {  IHeaderOverride, IStyledProps } from '@cyntler/react-doc-viewer';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

import { useAppSelector } from "../../app/hooks";
import { useSkipRender } from "../hooks/useSkipRender";
import { documentActions } from '../../docs/documentSlice';
import DocumentDetailsForm from '../forms/DocumentDetails';
import { ITEM_PATH } from "../shared/constants";
import { emptyDocumentDetails } from "../../docs/initialDocumentDetails";
import { UploadAccessLevel } from "../widgets/AWSFileUploader";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";

// MUI Box replacements for styled-components (kept for reference if custom header is re-enabled)
const viewHeaderContainerSx = {
   display: 'flex',
   justifyContent: 'flex-end',
   alignItems: 'center',
   zIndex: 1,
   padding: '0 10px',
   fontSize: '16px',
   minHeight: '50px',
   '@media (max-width: 768px)': {
      minHeight: '30px',
      padding: '5px',
      fontSize: '10px'
   }
};

const viewFileNameContainerSx = {
   flex: 1,
   textAlign: 'left',
   fontWeight: 'bold',
   margin: '0 10px',
   overflow: 'hidden'
};

const ItemPage = () =>
{
   const location = useLocation();
   const skipRender = useSkipRender(ITEM_PATH);

   const dispatch = useDispatch();
   const { itemId } = useParams(); //Item 
   console.log('ItemId:', itemId);

   const docDeets = useAppSelector(state => state.document.item);

   useEffect(() => {
      if ( skipRender() ) { return; }
      if ( !itemId ) { return; }
      if ( docDeets && docDeets.id === itemId ) { return; }
      dispatch(documentActions.getDocumentById(itemId!));
   }, [itemId, skipRender, dispatch]);


   //if ( itemId !== docDeets.id && docDeets.id === '' )
   //{ dispatch(documentActions.getDocumentById(itemId!)); }

   //console.log('File to Render:', docDeets.fileKey);
   //console.log('File to Render:', docDeets);

   const [AWSUrl, setAWSUrl] = useState('');

   const getAwsUrl = useCallback(() =>
   {
      if (docDeets.fileKey)
      {
         getUrl({key: docDeets.fileKey, options: UploadAccessLevel})
            .then(value => {
                   setAWSUrl(value.url.toString());
                   console.log('AWSUrl:', value.url.toString(),
                               '\nFound for:', docDeets.fileKey);
                  });
         // For public files, construct direct S3 URL without presigning
         // const publicUrl = `https://haliamwaal-s3211334-dev.s3.us-west-2.amazonaws.com/public/${docDeets.fileKey}`;
         // setAWSUrl(publicUrl);
         // console.log(`Public URL: ${publicUrl}`);
         // getUrl({key: `${docDeets.fileKey}`, options: {accessLevel: 'guest'} })
         //    //{key: docDeets.fileKey, options: UploadAccessLevel})
         //    .then(value => {
         //           setAWSUrl(value.url.toString());
         //           console.log(`AWSUrl: ${value.url.toString()} \nFound for: ${docDeets.fileKey}`);
         //          });
      }
   }, [docDeets]);

   useEffect(() => {
      if ( skipRender() ) { return; }
      getAwsUrl();
   }, [docDeets, getAwsUrl, skipRender]);

   let viewer = useRef(
      <div data-testid="react-doc-viewer-wrapper">
        <span>No Document to Display</span>
      </div>
   );

   const buildViewer = useCallback(async () =>
   {
      if ( AWSUrl !== '' )
      {  /* Viewer is inconsistent :(
          * Look into a paid service like ASPOSE
          * https://purchase.aspose.cloud/pricing
          * 
          * To enable custom header, uncomment below:
          * 
         const viewHeader: IHeaderOverride = async (state, previousDocument, nextDocument) =>
         {
            const { DocumentNav } = await import("@cyntler/react-doc-viewer/dist/components/DocumentNav");
            const { getFileName } = await import("@cyntler/react-doc-viewer/dist/utils/getFileName");
            const fileName = getFileName(state.currentDocument,
                                         state.config?.header?.retainURLParams || false);
            return (
              <Box id="header-bar" data-testid="header-bar" sx={viewHeaderContainerSx}>
                <Box sx={viewFileNameContainerSx}>
                  <a href={AWSUrl}>{fileName}</a>
                </Box>
                <DocumentNav />
              </Box>
            );
         }
         */
         //const { DocViewerRenderers } = await import('@cyntler/react-doc-viewer');
         viewer.current = (<div data-testid="react-doc-viewer-wrapper">
                     <DocViewer prefetchMethod="GET"
                                pluginRenderers={DocViewerRenderers}
                                documents={[{uri: AWSUrl,
                                             fileType: docDeets.type ?? undefined,}]}
                     />
                  </div>);
      }
   }, [AWSUrl, viewer, docDeets.type]);

   if ( docDeets.fileKey ) { buildViewer(); }
   useEffect(() =>
   {
      if ( skipRender() ) { return; }
      buildViewer();
   }, [AWSUrl, skipRender]);

   if ( skipRender() ) { return <></>; }

   return (
          <div className='twoColumn' >
            <div> {viewer.current} </div>
            <div>
              <DocumentDetailsForm pageTitle='dzabn (Item Details)'
                                   editable={true} isVersion={true}
                                   doc={docDeets}
              />
            </div>
          </div>
          );
};

export default ItemPage;
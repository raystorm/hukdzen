import React, { useCallback, useEffect, useRef, useState} from 'react';
import { useDispatch } from 'react-redux';
import {matchPath, useLocation, useParams} from 'react-router';
import { getUrl } from '@aws-amplify/storage';

import styled from "styled-components";
import DocViewer,
       {
          DocViewerRenderers, IHeaderOverride, IStyledProps
       } from '@cyntler/react-doc-viewer';
//import { DocumentNav } from "@cyntler/react-doc-viewer/dist/components/DocumentNav";
//import { getFileName } from "@cyntler/react-doc-viewer/dist/utils/getFileName";

import { useAppSelector } from "../../app/hooks";
import { documentActions } from '../../docs/documentSlice';
import DocumentDetailsForm from '../forms/DocumentDetails';
import { ITEM_PATH } from "../shared/constants";
import { emptyDocumentDetails } from "../../docs/initialDocumentDetails";
import { UploadAccessLevel } from "../widgets/AWSFileUploader";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";

//TODO: if I keep, switch to inline <div>
/* duplicate from React-viewer */
const ViewHeaderContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 1;
  padding: 0 10px;
  background-color: ${(props: IStyledProps) => props.theme.primary};
  font-size: 16px;
  min-height: 50px;

  @media (max-width: 768px) {
    min-height: 30px;
    padding: 5px;
    font-size: 10px;
  }
`; //end of styled.div

const ViewFileNameContainer = styled.div`
  flex: 1;
  text-align: left;
  font-weight: bold;
  margin: 0 10px;
  overflow: hidden;
`; //end of styled.div

const ItemPage = () =>
{
   const location = useLocation();
   const skipRender = useCallback(
      (): boolean => !matchPath(ITEM_PATH, location.pathname), [location]
   );

   const dispatch = useDispatch();
   const { itemId } = useParams(); //Item 
   console.log(`ItemId: ${itemId}`);

   const docDeets = useAppSelector(state => state.document);// ?? emptyDocumentDetails);

   useEffect(() => {
      if ( skipRender() ) { return; }
      if ( !itemId ) { return; }
      if ( docDeets && docDeets.id === itemId ) { return; }
      dispatch(documentActions.getDocumentById(itemId!));
   }, [itemId, skipRender, dispatch]);


   //if ( itemId !== docDeets.id && docDeets.id === '' )
   //{ dispatch(documentActions.getDocumentById(itemId!)); }

   //console.log(`File to Render: ${docDeets.fileKey}`);
   //console.log(`File to Render: ${JSON.stringify(docDeets)}`);

   const [AWSUrl, setAWSUrl] = useState('');

   const getAwsUrl = useCallback(() =>
   {
      if (docDeets.fileKey)
      {
         getUrl({key: docDeets.fileKey, options: UploadAccessLevel})
            .then(value => {
                   setAWSUrl(value.url.toString());
                   console.log(`AWSUrl: ${value.url.toString()} \nFound for: ${docDeets.fileKey}`);
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

   const buildViewer = useCallback(() =>
   {
      if ( AWSUrl !== '' )
      {  /* Viewer is inconsistent :(
          * Look into a paid service like ASPOSE
          * https://purchase.aspose.cloud/pricing * /
         const viewHeader: IHeaderOverride = (state, previousDocument, nextDocument) =>
         {
            //const fileName = styled(<FileName />)`color: unset;`;
            const fileName = getFileName(state.currentDocument,
                                                state.config?.header?.retainURLParams
                                              || false);
            return (
              <ViewHeaderContainer id="header-bar" data-testid="header-bar">
                <ViewFileNameContainer>
                  <a href={AWSUrl}>{fileName}</a>
                </ViewFileNameContainer>
                <DocumentNav />
              </ViewHeaderContainer>
            );
         }
         */
         viewer.current = (<div data-testid="react-doc-viewer-wrapper">
                     <DocViewer prefetchMethod="GET"
                                pluginRenderers={DocViewerRenderers}
                                documents={[{uri: AWSUrl,
                                             fileType: docDeets.type ?? undefined,}]}
                                //config={{ header: { overrideComponent: viewHeader, } }}
                     />
                  </div>);
      }
      //console.log(`AWSUrl ${AWSUrl}`);
      //console.log(`DocDeets \n ${JSON.stringify(docDeets, null, 2)}`);
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
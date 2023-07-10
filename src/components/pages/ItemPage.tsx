import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {matchPath, useLocation, useParams} from 'react-router-dom';
import { Storage } from "aws-amplify";

import styled from "styled-components";
import DocViewer, {DocViewerRenderers, IHeaderOverride, IStyledProps} from '@cyntler/react-doc-viewer';
import {DocumentNav} from "@cyntler/react-doc-viewer/dist/esm/components/DocumentNav";
import { getFileName } from "@cyntler/react-doc-viewer/dist/esm/utils/getFileName";

import { useAppSelector } from "../../app/hooks";
import { documentActions } from '../../docs/documentSlice';
import { DocumentDetails } from '../../docs/DocumentTypes';
import DocumentDetailsForm from '../forms/DocumentDetails';
import {ITEM_PATH} from "../shared/constants";


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
`;

const ViewFileNameContainer = styled.div`
  flex: 1;
  text-align: left;
  font-weight: bold;
  margin: 0 10px;
  overflow: hidden;
`;

const ItemPage = () =>
{
   const location = useLocation();
   const skipRender = (): boolean => !matchPath(ITEM_PATH, location.pathname);

   const dispatch = useDispatch();
   const { itemId } = useParams(); //Item 
   console.log(`ItemId: ${itemId}`);

   useEffect(() => {
      if ( skipRender() ) { return; }
      dispatch(documentActions.selectDocumentById(itemId!));
   }, [itemId]);

   const docDeets = useAppSelector(state => state.document);

   //console.log(`File to Render: ${docDeets.fileKey}`);
   console.log(`File to Render: ${JSON.stringify(docDeets)}`);

   const [AWSUrl, setAWSUrl] = useState('');

   const getAwsUrl = () =>
   {
      if (docDeets.fileKey)
      {
         Storage.get(docDeets.fileKey, { level: 'protected', })
                .then(value => {
                   setAWSUrl(value);
                   console.log(`AWSUrl: ${value} \nFound for: ${docDeets.fileKey}`);
                });
      }

   };

   useEffect(() => {
      if ( skipRender() ) { return; }
      docDeets.fileKey && getAwsUrl()
   }, [docDeets]);

   let viewer = <span>No Document to Display</span>;
   //const [viewer, setViewer] = useState(<span>No Document to Render</span>);

   const buildViewer = () =>
   {
      if ( AWSUrl != '' )
      {  /* Viewer is inconsistent :(
          * Look into a paid service like ASPOSE
          * https://purchase.aspose.cloud/pricing */
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
         viewer = (<>
                     <DocViewer prefetchMethod="GET"
                                pluginRenderers={DocViewerRenderers}
                                documents={[{uri:AWSUrl,
                                             fileType: docDeets.type ?? undefined, }]}
                                config={{ header: { overrideComponent: viewHeader, } }}
                                /*documents={viewMe}/>*/
                     />
                  </>);
      }
      //console.log(`AWSUrl ${AWSUrl}`);
      //console.log(`DocDeets \n ${JSON.stringify(docDeets, null, 2)}`);
   };

   if ( docDeets.fileKey ) { buildViewer(); }
   useEffect(() =>
   {
      if ( skipRender() ) { return; }
      buildViewer()
   }, [AWSUrl]);

   if ( skipRender() ) { return <></>; }

   return (
          <div className='twoColumn' >
            <div>
              {viewer}
            </div>
            <div>
              <DocumentDetailsForm pageTitle='dzabn (Item Details)'
                                   editable={true} isVersion={true}
                       { ...docDeets }
              />
            </div>
          </div>
          );
};

export default ItemPage;
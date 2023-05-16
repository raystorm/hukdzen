import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Storage } from "aws-amplify";

import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

import { useAppSelector } from "../../app/hooks";
import { documentActions } from '../../docs/documentSlice';
import { DocumentDetails } from '../../docs/DocumentTypes';
import DocumentDetailsForm from '../forms/DocumentDetails';

const ItemPage = () =>
{
   const dispatch = useDispatch();
   const { itemId } = useParams(); //Item 
   console.log(`ItemId: ${itemId}`);

   useEffect(() => { dispatch(documentActions.selectDocumentById(itemId)); },
             [itemId, dispatch]);

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

   useEffect(() => {docDeets.fileKey && getAwsUrl()}, [docDeets]);

   let viewer = <span>No Document to Display</span>;
   //const [viewer, setViewer] = useState(<span>No Document to Render</span>);

   const buildViewer = () =>
   {
      if ( AWSUrl != '' )
      {
         /* Viewer is inconsistent :( */
         viewer = (<DocViewer prefetchMethod="GET"
                             pluginRenderers={DocViewerRenderers}
                              documents={[{uri:AWSUrl}]}/>);
                             //documents={viewMe}/>);
      }
      //console.log(`AWSUrl ${AWSUrl}`);
      //console.log(`DocDeets \n ${JSON.stringify(docDeets, null, 2)}`);
   };

   if ( docDeets.fileKey ) { buildViewer(); }
   useEffect(() => { buildViewer() }, [AWSUrl]);

   return (
          <div className='twoColumn' >
            <div>
              {viewer}
            </div>
            <div>
              <DocumentDetailsForm pageTitle=' dzabn (Item Details)' 
                                   editable={true} isVersion={true}
                       { ...docDeets }
              />
            </div>
          </div>
          );
};

export default ItemPage;
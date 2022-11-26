import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

import { ReduxState } from '../../app/reducers';
import ReduxStore from '../../app/store';
import { documentActions } from '../../docs/documentSlice';
import { DocumentDetails } from '../../docs/DocumentTypes';
import DocumentDetailsForm from '../forms/DocumentDetails';


export default function ItemPage()
{
   const { itemId } = useParams(); //Item 
   console.log(`ItemId: ${itemId}`);

   useEffect(() => {
     ReduxStore.dispatch(documentActions.selectDocumentById(itemId));
   }, [itemId]);

   const docDeets = useSelector<ReduxState, DocumentDetails>
                               (state => state.document);

   console.log(`File to Render: ${docDeets.filePath}`);

   let viewer = <span>No Document to Render</span>;
   if ( docDeets.filePath )   
   {
      const viewMe = [ { uri: docDeets.filePath } ];
      viewer = <DocViewer pluginRenderers={DocViewerRenderers}
                          documents={viewMe} />;
   }

   //TODO: Document/Image Preview                               
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
          )
}
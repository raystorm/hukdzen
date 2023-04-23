import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

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

   console.log(`File to Render: ${docDeets.filePath}`);

   let viewer = <span>No Document to Render</span>;
   if ( docDeets.filePath )   
   {
      const viewMe = [ { uri: docDeets.filePath } ];
      viewer = <DocViewer pluginRenderers={DocViewerRenderers}
                          documents={viewMe} />;
   }

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
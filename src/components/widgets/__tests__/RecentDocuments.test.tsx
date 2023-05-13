import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithState } from '../../../utilities/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import RecentDocuments from '../RecentDocuments';

const initialDocument: DocumentDetails = {
  id: 'DOCUMENT-GUID-HERE',
  title: 'TEST DOCUMENT TITLE',
  description: 'TEST DOCUMENT DESCRIPTION',
  filePath: '/PATH/TO/TEST/FILE',
  type: 'application/example',
  ownerId: 'USER-GUID-HERE', //TODO copy a setup test GUID
  authorId: 'USER-GUID-HERE', //TODO copy a setup test GUID
  version: 1,
  created: new Date(), //TODO set specific dates/times
  updated: new Date(),
  bc: { title: 'Nahawat-BC', description: 'Magon-BC', },
  ak: { title: 'Nahawat-AK', description: 'Magon-AK', },
};

const STATE = {
  documentList: [initialDocument]
}

describe('RecentDocuments  widget', () => {

  test('renders correctly', () => { 
    
    renderWithState(STATE, <RecentDocuments />);

    expect(screen.getByText("Sut'amiis da lax sa'winsk (Recent Documents)"))
      .toBeInTheDocument();
  });

});
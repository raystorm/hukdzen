import react from 'react'
import { screen,  } from '@testing-library/react'

import { contains, renderWithState } from '../../../utilities/testUtilities';
import { Gyet } from '../../../User/userType';
import UploadPage, { title } from '../UploadPage';

const TEST_USER: Gyet = {
  id: 'UPLOAD_USER_GUID_HERE',
  name: 'I Upload Test Documents',
  waa: 'hukmalsk', //author
  email: 'uploader@example.com',  
}

const initState = {
  user: TEST_USER
}

describe('Upload Page', () => { 
  test('renders correctly', () => {

    renderWithState(initState, <UploadPage />);
    
    expect(screen.getByText(contains(title))).toBeInTheDocument();

    //TODO: verify author
  });
});
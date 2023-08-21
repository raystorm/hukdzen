import react from 'react'
import { screen,  } from '@testing-library/react'

import {contains, renderPage, } from '../../../__utils__/testUtilities';
import {emptyUser, User} from '../../../User/userType';
import UploadPage, { title } from '../UploadPage';
import {UPLOAD_PATH} from "../../shared/constants";

const TEST_USER: User = {
  ...emptyUser,
  id: 'UPLOAD_USER_GUID_HERE',
  name: 'I Upload Test Documents',
  waa: 'hukmalsk', //author
  email: 'uploader@example.com',  
}

const initState = {
  user: TEST_USER
}

describe('Upload Page', () => {

  test('renders correctly', () =>
  {
    renderPage(UPLOAD_PATH, <UploadPage />, initState);

    expect(screen.getByText(contains(title))).toBeInTheDocument();

    //TODO: verify author
  });
});
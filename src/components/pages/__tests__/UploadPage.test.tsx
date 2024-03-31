import react from 'react'
import {fireEvent, screen, waitFor, within,} from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import path from "path";
import {when} from "jest-when";
import {Storage} from "aws-amplify";

import {contains, renderPage,} from '../../../__utils__/testUtilities';
import {loadLocalFile} from "../../../__utils__/fileUtilities";
import {verifyField} from '../../../__utils__/DocumentDetailsUtilities';
import {emptyUser, User} from '../../../User/userType';
import UploadPage, { title } from '../UploadPage';
import {UPLOAD_PATH} from "../../shared/constants";
import {dropFilesText} from "../../widgets/AWSFileUploader";
import {emptyDocumentDetails} from "../../../docs/initialDocumentDetails";
import {DocumentDetailsFieldDefinition} from "../../../types/fieldDefitions";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {printGyet} from "../../../Gyet/GyetType";

const author: Author = {
   ...emptyAuthor,
   id: 'AUTHOR_GUID',
   name: 'example Author',
   email: 'author@example.com'
}

const TEST_USER: User = {
  ...emptyUser,
  id: 'UPLOAD_USER_GUID_HERE',
  name: 'I Upload Test Documents',
  waa: 'hukmalsk', //author
  email: 'uploader@example.com',  
}

const initBox: Xbiis = {
   ...emptyXbiis,
   id: 'BOX-GUID',
   name: 'Test Box o AWESOME!',
   owner: TEST_USER,
   xbiisOwnerId: author.id,
}

const initState = {
  user: TEST_USER,
  author: author,
  document: {
     ...emptyDocumentDetails,

     id:              'DOCUMENT-GUID-HERE',
     eng_title:       'TEST DOCUMENT TITLE',
     eng_description: 'TEST DOCUMENT DESCRIPTION',

     bc_title: 'Nahawat-BC', bc_description: 'Magon-BC',
     ak_title: 'Nahawat-AK', ak_description: 'Magon-AK',

     author:                    author,
     docOwner:                  TEST_USER,
     documentDetailsAuthorId:   author.id,
     documentDetailsDocOwnerId: TEST_USER.id,

     box:                  initBox,
     documentDetailsBoxId: initBox.id,

     //fileKey: '/PATH/TO/TEST/FILE',
     //type:    'application/example',
     version: 1,

     created: new Date().toISOString(), //TODO set specific dates/times
     updated: new Date().toISOString(),
  }
}

const fd = DocumentDetailsFieldDefinition;
userEvent.setup();

describe('Upload Page', () => {

  test('renders correctly', () =>
  {
    renderPage(UPLOAD_PATH, <UploadPage />, initState);

    expect(screen.getByText(contains(title))).toBeInTheDocument();
  });

  test('On success, Save Button triggers Save action, and form is cleared.',
       async () =>
  {
     const { store } = renderPage(UPLOAD_PATH, <UploadPage />, initState);

     //upload file
     expect(screen.queryByText('Disabled Until a Box is Selected'))
        .not.toBeInTheDocument();
     //screen.debug(screen.getByTestId('awsFileUploader'));
     const dropZone = screen.getByText(dropFilesText);

     expect(dropZone).toBeInTheDocument();

     Storage.put = jest.fn();
     //@ts-ignore
     when(Storage.put).mockResolvedValue({ key: 'file' });

     //resolves from project root instead of file.
     const logoFile = loadLocalFile(path.resolve('./src/images/ovoid.svg'));
     fireEvent.drop(dropZone, { dataTransfer: { files: [logoFile] } });

     //verify file type is correctly determined and set post, upload
     await waitFor(() => {
        expect(screen.getByLabelText(fd.type.label)).toHaveValue('image/svg+xml');
     }, { timeout: 2000 }); //wait 2 seconds for the upload

     //check for file preview
     expect(screen.getByText('ovoid.svg')).toBeInTheDocument();

     //file finished uploading
     await waitFor(() => {
       expect(screen.getByText('Uploaded')).toBeInTheDocument();
     });

     //new does not increment version
     expect(screen.getByLabelText(fd.version.label)).toHaveValue(1);

     //visible
     const create = 'Ma̱ngyen (Upload(Create New Item))';
     expect(screen.getByText(create)).toBeInTheDocument();

     // @ts-ignore
     const actionCount = store.dispatch.mock.calls.length;
     expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

     //trigger save action
     await userEvent.click(screen.getByText(create));

     //verify action was fired
     await waitFor(() => {
       expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
     }, { timeout: 2000 });

     const doc = emptyDocumentDetails;

     const idField = screen.getByTestId(fd.id.name);
     expect(idField).toBeInTheDocument();
     expect(idField).not.toBeVisible();
     //validate ID changed
     expect(idField).not.toHaveValue(initState.document.id);
     // eslint-disable-next-line testing-library/no-node-access
     expect(document.getElementsByName('id')[0] as HTMLInputElement)
       .not.toHaveValue(doc.id);

     verifyField(fd.eng_title,       doc.eng_title);
     verifyField(fd.eng_description, doc.eng_description);

     verifyField(fd.docOwner,       printGyet(TEST_USER));
     verifyField(fd.author,         author.name);

     verifyField(fd.bc_title,       doc.bc_title);
     verifyField(fd.bc_description, doc.bc_description);

     verifyField(fd.ak_title,       doc.ak_title);
     verifyField(fd.ak_description, doc.ak_description);

     //cleared so no file
     const dlLink = screen.queryByText('Download Current File');
     expect(dlLink).not.toBeInTheDocument();

     verifyField(fd.type, `${doc.type}`);

     verifyField(fd.version, doc.version);

     expect(store?.getState().document).toBe(emptyDocumentDetails);

     //check for file preview, NOT to be in the document
     expect(screen.queryByText('ovoid.svg')).not.toBeInTheDocument();

     //verifyDateField(fd.created, doc.created);
     //verifyDateField(fd.updated, doc.updated);

     //TODO: test for Alert Bar Success Message Visibility
  });

  /*
   *  TODO: test Upload for:
   *    * Error
   *      * does not clear form
   *      * does not clear file
   *      * displays Alert w/ Error
   */
});
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import path from 'path';
import { renderWithProviders, startsWith } from '../../../utilities/testUtilities';
import { loadLocalFile } from '../../../utilities/fileUtilities';
import FileUpload from '../FileUpload';
import DZUInput from '../DZUInput';
import Dropzone, { IDropzoneProps } from 'react-dropzone-uploader';
import xhrMock, { proxy } from 'xhr-mock';
import 'jsdom-worker';

userEvent.setup();

describe('FileUpload widget', () => 
{ 
  /* full component test */
  test('FileUpload widget responds to file upload event', async () => 
  { 
     const uploadUrl = 'https://httpbin.org/post'
     const uploadDone = jest.fn();
     renderWithProviders(<FileUpload uploadUrl={uploadUrl}
                                     whenUploadComplete={uploadDone} />);

     const dropZone = screen.getByLabelText(startsWith('Drag and Drop a File,'));

     expect(dropZone).toBeInTheDocument();
     screen.debug(dropZone);

     console.log(`XMLHttpRequest:\n ${JSON.stringify(new XMLHttpRequest())}`);

     //resolves from project root instead of file.
     const logoFile = loadLocalFile(path.resolve('./src/images/logo.svg'));

     xhrMock.setup();
     xhrMock.post(uploadUrl, { status: 200, reason: 'OK' });

     await fireEvent.drop(dropZone, { dataTransfer: { files: [logoFile] } });

     await waitFor(() => { expect(uploadDone).toHaveBeenCalled() });
   });
   // */

  test('DropZone successfully uploads a file', async () => 
  { 
    const binURL = 'https://httpbin.org/post';

    const getUploadParams = () =>
    { return { url: binURL } }

    const handleChangeStatus = jest.fn();

    render(<Dropzone maxFiles={1} multiple={false}
                    inputContent='Send a file.'
                    getUploadParams={getUploadParams}
                    onChangeStatus={handleChangeStatus}
          />);

    const dropZone = screen.getByLabelText(/^Send a file\./);
    
    expect(dropZone).toBeInTheDocument();
    screen.debug(dropZone);

    const logoFile = new File(['Hello'], 'hello.txt', { type: 'text/plain' });

    xhrMock.setup();
    xhrMock.post(binURL, { status: 200, reason: 'OK' });

    await fireEvent.drop(dropZone, { dataTransfer: { files: [logoFile] } });

    await waitFor(() => {
      const lasCallArgs = handleChangeStatus.mock.lastCall;
      //console.log(`FWM: ${JSON.stringify(lasCallArgs[0])}`);
      //console.log(`FWM.meta: ${JSON.stringify(lasCallArgs[0].meta)}`);
      expect(lasCallArgs[0].meta.status).toBe('done');
    });
  });
  
   /* Working test with DropZone element */
   test('DropZone responds to file upload event', async () => 
   { 
      const getUploadParams: IDropzoneProps['getUploadParams'] = () =>
      { return { url: 'https://httpbin.org/post' } }  

      const handleChangeStatus = jest.fn();

      renderWithProviders(<Dropzone maxFiles={1} multiple={false}
                                    inputContent='Send a file.'
                                    getUploadParams={getUploadParams}
                                    onChangeStatus={handleChangeStatus}
                          />);
 
      const dropZone = screen.getByLabelText(startsWith('Send a file'));
     
      expect(dropZone).toBeInTheDocument();
      screen.debug(dropZone);
 
      //resolves from project root instead of file.
      const logoFile = loadLocalFile(path.resolve('./src/images/logo.svg'));
 
      await fireEvent.drop(dropZone, { dataTransfer: { files: [logoFile] } });

      //console.log(`Status Changed [${handleChangeStatus.mock.calls.length}] times.`);
      //console.log(`Status change: ${JSON.stringify(handleChangeStatus.mock.calls[0])}`);
      expect(handleChangeStatus).toHaveBeenCalled();
   });
   // */ 

   /* Valid test
   test('upload file', async () => 
   {
    renderWithProviders(
      <div>
        <label htmlFor="file-uploader">Upload file:
          <input id="file-uploader" type="file" />
        </label>
      </div>
    );

    const file = new File(['hello'], 'hello.png', {type: 'image/png'});
    const input = screen.getByLabelText(startsWith('Upload file'));

    screen.debug(input);
  
    await userEvent.upload(input, file);
  
    expect(input.files[0]).toBe(file);
    expect(input.files.item(0)).toBe(file);
    expect(input.files).toHaveLength(1);
  })
  // */
});
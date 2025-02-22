import {
   UploadDataWithPathOutput, ItemWithPath,
   DownloadDataOutput, RemoveOutput,
   ListAllOutput, ListPaginateOutput,
   GetPropertiesOutput, CopyOutput, GetUrlOutput,
} from "@aws-amplify/storage/src/providers/s3/types/outputs";
import {
   UploadDataWithPathInput, DownloadDataInput, RemoveInput,
   ListAllInput, ListPaginateInput, GetPropertiesInput,
   CopyInput, GetUrlInput,
} from "@aws-amplify/storage/src/providers/s3/types/inputs";
import itemPage from "../../components/pages/ItemPage";

export type {
   UploadDataOutput, DownloadDataOutput, RemoveOutput,
   ListAllOutput, ListPaginateOutput, GetPropertiesOutput, CopyOutput, GetUrlOutput,
} from "@aws-amplify/storage/src/providers/s3/types/outputs";

export type {
   UploadDataInput, DownloadDataInput, RemoveInput,
   ListAllInput, ListPaginateInput, GetPropertiesInput, CopyInput, GetUrlInput,
}   from "@aws-amplify/storage/src/providers/s3/types/inputs";

console.log('Mocking AWS Storage functions');

const storage: any = jest.createMockFromModule('aws-amplify/storage');


//TODO: set impl functions to be able to use Mocks

let urlForTest: URL | null = null;

/**
 *  Helper function for getUrl to set the url for testing
 *  @param url - the url to set
 */
export const setUrlForTest = (url: URL | null) => { urlForTest = url; }

/**
 *  Stubbed implementation of getUrl,
 *  returns FileKey as URL unless setUrlForTest() used
 *  @param key
 */
export const getUrl = (key: GetUrlInput) => Promise.resolve({
                url: urlForTest ?? new URL(`file://${key.key}`), expiresAt: new Date(),
             } as GetUrlOutput);

export const downloadData = (input: DownloadDataInput) => ({ } as DownloadDataOutput);

/**
 *  Stubbed implementation of copy, returns destination key
 *  @param key
 */
export const copy = (key: CopyInput) =>
             Promise.resolve({ key: key.destination.key } as CopyOutput);

export const remove = (input: RemoveInput) => Promise.resolve({} as RemoveOutput);

/**
 *  Stubbed implementation of uploadData, returns key
 *  @param key
 */
const uploadDataImpl = (key: UploadDataWithPathInput) =>
      {
         console.log('Called uploadData');
         const item: ItemWithPath = { ...key, path: key.path ? key.path.toString() : '' };

         return {
            cancel: (message?: string) => jest.fn(),
            pause:  jest.fn(),
            resume: jest.fn(),
            state:  'SUCCESS',
            result: Promise.resolve(key), // then: jest.fn() }),
            //result: Promise.resolve({key: key.key}), // then: jest.fn() }),
            //then: jest.fn(),
         } as UploadDataWithPathOutput
      };

export const uploadData = uploadDataImpl

storage.setUrlForTest = setUrlForTest;

storage.getUrl       = getUrl;
storage.downloadData = downloadData;
storage.copy         = copy;
storage.remove       = remove;
storage.uploadData   = uploadData;

export default storage;


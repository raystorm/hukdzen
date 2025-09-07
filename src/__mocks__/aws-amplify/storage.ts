import {vi} from 'vitest';
import {
   UploadDataOutput, UploadDataWithPathOutput,
   DownloadDataOutput, RemoveOutput,
   ListAllOutput, ListPaginateOutput,
   ItemWithPath, GetPropertiesOutput, CopyOutput, GetUrlOutput,
} from "@aws-amplify/storage/src/providers/s3/types/outputs";
import {
   UploadDataInput, UploadDataWithPathInput,
   DownloadDataInput, RemoveInput,
   ListAllInput, ListPaginateInput,
   GetPropertiesInput, CopyInput, GetUrlInput,
} from "@aws-amplify/storage/src/providers/s3/types/inputs";
import type {PathInput} from "../../components/FileUploader/utils/uploadFile";

export type {
   UploadDataOutput, DownloadDataOutput, RemoveOutput,
   ListAllOutput, ListPaginateOutput, GetPropertiesOutput, CopyOutput, GetUrlOutput,
} from "@aws-amplify/storage/src/providers/s3/types/outputs";

export type {
   UploadDataInput, DownloadDataInput, RemoveInput,
   ListAllInput, ListPaginateInput, GetPropertiesInput, CopyInput, GetUrlInput,
}   from "@aws-amplify/storage/src/providers/s3/types/inputs";

console.log('Mocking AWS Storage functions');

const storage: any = vi.importActual('aws-amplify/storage');


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
const uploadDataImpl = (key: PathInput | UploadDataInput) =>
      {
         console.log('Called uploadData');
         //const item: ItemWithPath = { ...key, path: key.path ? key.path.toString() : '' };

         return {
            cancel: (message?: string) => vi.fn(),
            pause:  vi.fn(),
            resume: vi.fn(),
            state:  'SUCCESS',
            result: Promise.resolve({ key:  (key as any).key || (key as any).path,
                                      data: (key as any).data
                                    })
         } as UploadDataOutput | UploadDataWithPathOutput
      };

export const uploadData = (key: PathInput | UploadDataInput) => uploadDataImpl(key);

storage.setUrlForTest = setUrlForTest;

storage.getUrl       = getUrl;
storage.downloadData = downloadData;
storage.copy         = copy;
storage.remove       = remove;
storage.uploadData   = uploadData;

export default storage;


import path from 'path';
import * as fs from 'fs';
import * as mime from 'mime-types';

/*
 * Helper functions to simplify working with File Objects
 * //stolen from:  https://raw.githubusercontent.com/abrwn/get-file-object-from-local-path/main/index.js
 */

/** placeholder type for creating Local `File`s from. */
export interface LocalFileData {
  arrayBuffer: ArrayBuffer,
  name: string,
  type?: string
};

/**
 *  Create `LocalFileData` helper object from local file on disk
 *  @param pathToFile path to the file to read
 */
export const createLocalFileData = (pathToFile: string) =>
{
  const buf         = fs.readFileSync(pathToFile);
  const arrayBuffer = buf.buffer.slice(buf.byteOffset,
                                          buf.byteOffset + buf.byteLength);

  const name = path.basename(pathToFile);

  const type = mime.lookup(path.extname(pathToFile)) || undefined;

  return { arrayBuffer, name, type } as LocalFileData;
}

/**
 *  Build `File` Object from LocalFileData helper
 *  @param localFileData
 */
export const buildFileFromLocalFileData = (localFileData: LocalFileData) =>
{
  //const file = new File(localFileData.arrayBuffer, localFileData.name,
  const file = new File([localFileData.arrayBuffer], localFileData.name,
                        { type: localFileData.type });
   // Add bytes() method for checkExists compatibility, to full File object
   (file as any).bytes = async () => {
      return new Uint8Array(localFileData.arrayBuffer);
   };

   return file;
};

/**
 *  Creates a `File` object from a file on disk for testing.
 *  @param pathToFile path to the file to create a file Object from.
 */
export const loadLocalFile = (pathToFile: string) =>
{ return buildFileFromLocalFileData(createLocalFileData(pathToFile)); }

import path from 'path';
import * as fs from 'fs';
import * as mime from 'mime-types';

/*
 * Helper functions to simplify working with File Objects
 * //stolen from:  https://raw.githubusercontent.com/abrwn/get-file-object-from-local-path/main/index.js
 */

export interface LocalFileData {
  arrayBuffer: Buffer[],
  name: string,
  type?: string
};

export const createLocalFileData = (pathToFile: string) =>
{
  const arrayBuffer = (() => 
  {
    const buffer = fs.readFileSync(pathToFile);
    const arrayBuffer = buffer.slice(buffer.byteOffset,
                                   buffer.byteOffset + buffer.byteLength);
    return [arrayBuffer];
  })();

  const name = path.basename(pathToFile);

  const type = mime.lookup(path.extname(pathToFile)) || undefined;
  
  return { arrayBuffer, name, type } as LocalFileData;
}

export const buildFileFromLocalFileData = (localFileData: LocalFileData) =>
{
  const file = new File(localFileData.arrayBuffer, localFileData.name,
                        { type: localFileData.type });
   // Add bytes() method checkExists compatibility, to full File object
   (file as any).bytes = async () => {
      return new Uint8Array(localFileData.arrayBuffer[0]);
   };

   return file;
};


export const loadLocalFile = (pathToFile: string) =>
{ return buildFileFromLocalFileData(createLocalFileData(pathToFile)); }

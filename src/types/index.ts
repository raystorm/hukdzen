/* Common Types */


export interface DocumentDetails
{
    id: string; //use GUID

    name: string; //title
    description: string;
    author: string; //TODO: link to user object    
    filePath: string;
    created: Date;
    updated: Date;
    type?: string; //image, word doc, etc, needs, a const list
    version: number;
    
    nahawtBC: string; //title
    magonBC: string;  //description
    nahawtAK: string; //title
    magonAK: string;  //description
};
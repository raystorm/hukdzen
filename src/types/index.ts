/* Common Types */

import { Label } from "@mui/icons-material";


export interface DocumentDetails
{
    id: string; //use GUID

    title:       string;
    description: string;
    author:      string; //TODO: link to user object    
    owner:       string; //TODO: link to user object
    filePath:    string;
    created?:    Date;
    updated?:    Date;
    type?:       string; //image, word doc, etc, needs, an enum list
    version:     number;
    
    /*
    nahawtBC: string; //title
    //nahawtBC: DocumentField; //title
    magonBC:  string;  //description
    //magonBC:  DocumentField;  //description
    nahawtAK: string; //title
    //nahawtAK: DocumentField; //title
    magonAK:  string;  //description
    //magonAK: DocumentField;  //description
    */

    bc: LangFields;
    ak: LangFields;
};

export interface DocumentField
{
    /** storage name of the field */
    name: string;
    
    /** label (display name of the field) */
    label: string;

    /** longform description of the field (useful as a tooltip.) */
    description?: string;

    value?: string | number;
}


export const buildDocField = (name: string, label: string, 
                              description: string) =>
{ 
   return { name: name, label: label, description: description, } as DocumentField
}

export interface LangFields {
    title: DocumentField;
    description: DocumentField;
}

export const buildLangFields =(title: DocumentField, 
                               description: DocumentField) => 
{ 
  return { title: title, description: description } as LangFields;
}
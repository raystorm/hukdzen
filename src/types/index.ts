/* Common Types */

import { Label } from "@mui/icons-material";


export interface DocumentDetails
{
    id: string; //use GUID

    name:        string; //title
    description: string;
    author:      string; //TODO: link to user object    
    filePath:    string;
    created:     Date;
    updated:     Date;
    type?:       string; //image, word doc, etc, needs, a const list
    version:     number;
    
    nahawtBC: string; //title
    //nahawtBC: DocumentField; //title
    magonBC:  string;  //description
    //magonBC:  DocumentField;  //description
    nahawtAK: string; //title
    //nahawtAK: DocumentField; //title
    magonAK:  string;  //description
    //magonAK: DocumentField;  //description

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

/*
const buildDocField:DocumentField = 
      (name: string, label: string, description: string) =>
{ 
   return { name: name, label: label, description: description, } as DocumentField
}
*/
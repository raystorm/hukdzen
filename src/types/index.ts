/* Common Types */

import { Label } from "@mui/icons-material";

//value type
export interface DocumentDetails
{
    id: string; //use GUID

    title:       string;
    description: string;
    authorId:    string; //TODO: link to user object    
    ownerId:     string; //TODO: link to user object
    filePath:    string;
    created?:    Date;
    updated?:    Date;
    type?:       string; //image, word doc, etc, needs, an enum list
    version:     number;
 
    bc: LangFields;
    ak: LangFields;
};

export interface LangFields {
    title: string;
    description: string;
}

//form definition type
export interface DocumentDetailsFD
{
    id:          FieldDefinition<string>; //use GUID
    title:       FieldDefinition<string>;
    description: FieldDefinition<string>;
    authorId:    FieldDefinition<string>; //TODO: link to user object    
    ownerId:     FieldDefinition<string>; //TODO: link to user object
    filePath:    FieldDefinition<string>;
    created?:    FieldDefinition<Date>;
    updated?:    FieldDefinition<Date>;
    type?:       FieldDefinition<string>; //image, word doc, etc, needs, an enum list
    version:     FieldDefinition<number>;
    
    bc: LangFieldsDefinition;
    ak: LangFieldsDefinition;
};

export interface LangFieldsDefinition {
    title: FieldDefinition<string>;
    description: FieldDefinition<string>;
}

export interface FieldDefinition<T = string | number | Date>
{
    /** storage name of the field */
    name: string;
    
    /** label (display name of the field) */
    label?: string;

    /** longform description of the field (useful as a tooltip.) */
    description?: string;

    value?: T;
}


export const buildFieldDefinition = 
       <T = string | number>(name: string, label: string, description: string) =>
{ 
   return { name: name, label: label, description: description, } as 
          FieldDefinition<T>;
}



export const buildLangFieldDefinitions =(title: FieldDefinition, 
                                         description: FieldDefinition) =>
{ 
  return { title: title, description: description } as LangFieldsDefinition;
}
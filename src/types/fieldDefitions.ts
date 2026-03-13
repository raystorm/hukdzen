
//form definition type
import { Xbiis } from "../Box/boxTypes";

export interface DocumentFD
{
    id:              FieldDefinition<string>; //use GUID
    eng:             SummaryFieldsDefinition;

    author:          FieldDefinition<string>;
    contentOwner:    FieldDefinition<string>;

    box:             FieldDefinition<Xbiis>;

    fileKey:         FieldDefinition<string>;
    created:         FieldDefinition<Date>;
    updated:         FieldDefinition<Date>;
    type:            FieldDefinition<string>; //image, word doc, etc., needs, an enum list
    version:         FieldDefinition<number>;

    bc:             SummaryFieldsDefinition;

    ak:             SummaryFieldsDefinition;
};

export interface SummaryFieldsDefinition
{
    title:       FieldDefinition<string>;
    description: FieldDefinition<string>;
}

export interface FieldDefinition<T = string | number | Date>
{
    /** storage name of the field */
    name: string;
    
    /** label (display name of the field) */
    label: string;

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


/*
export const buildLangFieldDefinitions =(title: FieldDefinition, 
                                         description: FieldDefinition) =>
{ 
  return { title: title, description: description } as LangFieldsDefinition;
}
*/

export const DocumentFieldDefinition: DocumentFD =
{   //Reminder: text for all fields
    id:          buildFieldDefinition('id', 'Id', 
                                      'GUID ID, Unique Document Identifier'),

    eng: {
        title:       buildFieldDefinition('eng_title', 'Title', 'Document Title'),
        description: buildFieldDefinition('eng_description', 'Description',
                                          'Long form Document Description'),
    },

    author:          buildFieldDefinition('author', "'Nii Int T'amt",
                                      'Identifies who wrote/created this file.'),
    contentOwner:    buildFieldDefinition('contentOwner', "'Nii na waalt",
                                      'Owner of the file for tracking and system permissions perposes'),

    box:         buildFieldDefinition('box', 'Box',
                                      'Container to hold the file.'),

    fileKey:     buildFieldDefinition('fileKey', 'AWS (S3) File Key',
                                      'Key to locating the File in AWS S3 Storage.'),
    created:     buildFieldDefinition('created', 'Created Date', 
                                      'When this file was initially created.'),
    updated:     buildFieldDefinition('updated', 'Updated Date', 
                                      'Most recent date when this file was changed.'),
    type:        buildFieldDefinition('type', 'File Type', 
                                      'Indicates what kind of file this is (Mime-Type).'),
    version:     buildFieldDefinition('version', 'Version', 'File Revision Number.'),


    bc: {
        title:       buildFieldDefinition('bc_title', 'Nahawt(BC)',
                                          'BC (Dunn) Orthography, Document Title'),
        description: buildFieldDefinition('bc_description', 'Magon(BC)',
                                          'BC (Dunn) Orthography, Document Description'),
    },

    ak: {
        title:       buildFieldDefinition('ak_title', 'Nahawt(AK)',
                                          'AK Orthography, Document Title'),
        description: buildFieldDefinition('ak_description', 'Magon(AK)',
                                          'AK Orthography, Document Description'),
    },
};

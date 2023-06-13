
//form definition type
export interface DocumentDetailsFD
{
    id:              FieldDefinition<string>; //use GUID
    eng_title:       FieldDefinition<string>;
    eng_description: FieldDefinition<string>;
    author:          FieldDefinition<string>;
    docOwner:        FieldDefinition<string>;
    fileKey:        FieldDefinition<string>;
    created:         FieldDefinition<Date>;
    updated:         FieldDefinition<Date>;
    type:            FieldDefinition<string>; //image, word doc, etc., needs, an enum list
    version:         FieldDefinition<number>;

    bc_title:       FieldDefinition<string>;
    bc_description: FieldDefinition<string>;

    ak_title:       FieldDefinition<string>;
    ak_description: FieldDefinition<string>;
};

/*
export interface LangFieldsDefinition {
    title: FieldDefinition<string>;
    description: FieldDefinition<string>;
}
*/

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

export const DocumentDetailsFieldDefinition: DocumentDetailsFD =
{   //TODO: text for all fields    
    id:          buildFieldDefinition('id', 'Id', 
                                      'GUID ID, Unique Document Identifier'),

    eng_title:       buildFieldDefinition('eng_title', 'Title', 'Document Title'),
    eng_description: buildFieldDefinition('eng_description', 'Description',
                                          'Long form Document Description'),


    author:      buildFieldDefinition('author', "'Nii Int T'amt",
                                      'Identifies who wrote/created this file.'),
    docOwner:    buildFieldDefinition('docOwner', "'Nii na waalt",
                                      'Owner of the file for tracking and system permissions perposes'),


    fileKey:     buildFieldDefinition('fileKey', 'AWS (S3) File Key',
                                      'Key to locating the File in AWS S3 Storage.'),
    created:     buildFieldDefinition('created', 'Created Date', 
                                      'When this file was initially created.'),
    updated:     buildFieldDefinition('updated', 'Updated Date', 
                                      'Most recent date when this file was changed.'),
    type:        buildFieldDefinition('type', 'File Type', 
                                      'Indicates what kind of file this is (Mime-Type).'),
    version:     buildFieldDefinition('version', 'Version', 'File Revision Number.'),


    bc_title:       buildFieldDefinition('bc_title', 'Nahawt(BC)',
                                         'BC (Dunn) Orthography, Document Title'),
    bc_description: buildFieldDefinition('bc_description', 'Magon(BC)',
                                         'BC (Dunn) Orthography, Document Description'),


    ak_title:       buildFieldDefinition('ak_title', 'Nahawt(AK)',
                                         'AK Orthography, Document Title'),
    ak_description: buildFieldDefinition('ak_description', 'Magon(AK)',
                                         'AK Orthography, Document Description'),

};

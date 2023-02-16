
//form definition type
export interface DocumentDetailsFD
{
    id:          FieldDefinition<string>; //use GUID
    title:       FieldDefinition<string>;
    description: FieldDefinition<string>;
    authorId:    FieldDefinition<string>; //TODO: link to user object    
    ownerId:     FieldDefinition<string>; //TODO: link to user object
    filePath:    FieldDefinition<string>;
    created:     FieldDefinition<Date>;
    updated:     FieldDefinition<Date>;
    type:        FieldDefinition<string>; //image, word doc, etc., needs, an enum list
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



export const buildLangFieldDefinitions =(title: FieldDefinition, 
                                         description: FieldDefinition) =>
{ 
  return { title: title, description: description } as LangFieldsDefinition;
}

export const DocumentDetailsFieldDefintion: DocumentDetailsFD = 
{   //TODO: text for all fields    
    id:          buildFieldDefinition('id', 'Id', 
                                      'GUID ID, Unique Document Identifier'),
    title:       buildFieldDefinition('title', 'Title', 'Document Title'),
    description: buildFieldDefinition('description', 'Description', 
                                      'Long form Document Description'),
    authorId:    buildFieldDefinition('authorId', "'Nii int t'amt", 
                                      'Identifies who created this file.'),
    ownerId:     buildFieldDefinition('ownerId', "'Nii na waalt", 
                                      'Owner of the file for tracking and system permissions perposes'),
    filePath:    buildFieldDefinition('filePath', 'File Path (Link to the file)',
                                      'Where the file is physically located on disk'),
    created:     buildFieldDefinition('created', 'Created Date', 
                                      'When this file was initially created.'),
    updated:     buildFieldDefinition('updated', 'Updated Date', 
                                      'Most recent date when this file was changed.'),
    type:        buildFieldDefinition('type', 'File Type', 
                                      'Indicates what kind of file this is (Mime-Type).'),
    version:     buildFieldDefinition('version', 'Version', 'File Revision Number.'),

    bc: buildLangFieldDefinitions(buildFieldDefinition('nahawtBC', 'Nahawt(BC)',
                                      'BC (Dunn) Orthography, Document Title'),
                        buildFieldDefinition('magonBC', 'Magon(BC)',
                                      'BC (Dunn) Orthography, Document Description')),
    ak: buildLangFieldDefinitions(buildFieldDefinition('nahawtAK', 'Nahawt(AK)',
                                      'AK Orthography, Document Title'),
                        buildFieldDefinition('magonAK', 'Magon(AK)',
                                      'AK Orthography, Document Description')),
};

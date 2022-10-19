import { Description } from "@mui/icons-material";
import { buildFieldDefinition, buildLangFieldDefinitions, DocumentDetails, DocumentDetailsFD } from ".";

export const DocumentDetailsFieldDefintion: DocumentDetailsFD = 
{   //TODO: text for all fields    
    id:          buildFieldDefinition('id', 'Id', 
                                      'GUID ID, Unique Document Identifier'),
    title:       buildFieldDefinition('title', 'Title', 'Document Title'),
    description: buildFieldDefinition('description', 'Description', 'Long form Document Description'),
    authorId:    buildFieldDefinition('authorId', 'Author', 'Identifies who created this file.'),
    ownerId:     buildFieldDefinition('ownerId', 'Owner', 'Owner of the file for tracking and system permissions perposes'),
    filePath:    buildFieldDefinition('filePath', 'File Path (Link to the file)',
                                      'Where the file is physically located on disk'),
    created:     buildFieldDefinition('created', 'Created Date', 
                                      'When this file was initially created.'),
    updated:     buildFieldDefinition('updated', 'Updated Date', 
                                      'Most recent date when this file was changed.'),
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


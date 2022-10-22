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


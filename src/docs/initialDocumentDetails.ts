import {DocumentDetails, LangFields} from "./DocumentTypes";
import {emptyGyet} from "../User/userType";
import {emptyXbiis} from "../Box/boxTypes";

const langFieldBuiler = () : LangFields => {
    return {
        __typename: 'LangFields',
        id: '',
        title: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export const initialDocumentDetail: DocumentDetails = {
    __typename:  "DocumentDetails",
    id:          "",
    title:       "",
    description: "",
    authorId:    emptyGyet,
    ownerId:     emptyGyet,
    filePath:    "",
    created:     new Date().toISOString(),
    updated:     undefined,
    version:     0,

    bc: langFieldBuiler(),
    ak: langFieldBuiler(),

    box: emptyXbiis,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};
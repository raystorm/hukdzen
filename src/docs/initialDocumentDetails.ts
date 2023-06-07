import {DocumentDetails, /*LangFields*/} from "./DocumentTypes";
import {emptyUser} from "../User/userType";
import {emptyAuthor} from "../Author/AuthorType";
import {emptyXbiis} from "../Box/boxTypes";

/*
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
*/

export const emptyDocumentDetails: DocumentDetails = {
    __typename:      "DocumentDetails",
    id:              "",
    eng_title:       "",
    eng_description: "",

    author:      emptyAuthor,
    docOwner:    emptyUser,

    documentDetailsAuthorId:   emptyAuthor.id,
    documentDetailsDocOwnerId: emptyUser.id,

    fileKey:     '',
    created:     new Date().toISOString(),
    updated:     undefined,
    version:     0,

    bc_title:       '',
    bc_description: '',

    ak_title:       '',
    ak_description: '',

    box: emptyXbiis,
    documentDetailsBoxId: emptyXbiis.id,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};
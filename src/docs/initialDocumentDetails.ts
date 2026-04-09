import {Document} from "./DocumentTypes";
import {emptyUser} from "../User/userType";
import {emptyAuthor} from "../Author/AuthorType";
import {emptyBox} from "../Box/boxTypes";

export const emptyDocument: Document = {
    __typename:      "Document",
    id:              "",
    
    eng: {
       __typename: "Summary",
       title:       "",
       description: "",
    },
    bc: null,
    ak: null,

    author:       emptyAuthor,
    contentOwner: emptyUser,

    documentAuthorId:           emptyAuthor.id,
    documentContentOwnerUserId: emptyUser.id,

    fileKey:     '',
    fileHash:    null,
    created:     new Date().toISOString(),
    updated:     null,
    version:     0,
    type:        null,

    box: emptyBox,
    documentBoxBoxId: emptyBox.id,

    keywords: null,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};
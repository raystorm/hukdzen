import { DocumentDetails } from "./DocumentTypes";

export const initialDocumentDetail: DocumentDetails = {
    id:          "",
    title:       "",
    description: "",
    authorId:    "",
    ownerId:     "",
    filePath:    "",
    created:     new Date(),
    updated:     undefined,
    version:     0,

    bc: { title: '', description: '' },
    ak: { title: '', description: '' },
};


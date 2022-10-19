import { Description } from "@mui/icons-material";
import { buildFieldDefinition, buildLangFieldDefinitions, DocumentDetails } from ".";

export const initialDocumentDetail: DocumentDetails = {
    id:          "",
    title:       "",
    description: "",
    authorId:    "",
    ownerId:     "",
    filePath:    "",
    created:     undefined,
    updated:     undefined,
    version:     0,

    bc: { title: '', description: '' },
    ak: { title: '', description: '' },
};


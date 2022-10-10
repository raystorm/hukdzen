import { Description } from "@mui/icons-material";
import { buildDocField, buildLangFields, DocumentDetails } from ".";

export const initialDocumentDetail: DocumentDetails = {
    id:          "",
    title:       "",
    description: "",
    author:      "",
    owner:       "",
    filePath:    "",
    created:     undefined,
    updated:     undefined,
    version:     0,

    bc: buildLangFields(buildDocField('nahawtBC', 'Nahawt(BC)',
                                      'BC (Dunn) Orthography, Document Title'),
                        buildDocField('magonBC', 'Magon(BC)',
                                      'BC (Dunn) Orthography, Document Description')),
    ak: buildLangFields(buildDocField('nahawtAK', 'Nahawt(AK)',
                                      'AK Orthography, Document Title'),
                        buildDocField('magonAK', 'Magon(AK)',
                                      'AK Orthography, Document Description')),
};


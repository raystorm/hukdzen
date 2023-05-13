import { DocumentDetails } from "../DocumentTypes";
import { ModelDocumentDetailsConnection } from "../../types/AmplifyTypes";


export const emptyDocList: ModelDocumentDetailsConnection = {
   __typename: "ModelDocumentDetailsConnection",
   items: [],
}
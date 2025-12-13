import {
         DocumentDetails as docType,
         //LangFields as langField
       } from "../types/AmplifyTypes";
import {Xbiis} from "../Box/boxTypes";

export type DocumentDetails = docType;

export interface MoveDocument {
   source:      string,
   destination: string,
   targetBox:   Xbiis,
}

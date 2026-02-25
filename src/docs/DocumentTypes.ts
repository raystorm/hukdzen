import {
         DocumentDetails as docType,
         //LangFields as langField
       } from "../graphql/API";
import { Xbiis } from "../Box/boxTypes";

export type DocumentDetails = docType;

export interface MoveDocument {
   source:      string,
   destination: string,
   targetBox:   Xbiis,
}

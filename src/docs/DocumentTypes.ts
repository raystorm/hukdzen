import {
         DocumentDetails as docType,
         //LangFields as langField
       } from "../types/AmplifyTypes";

export type DocumentDetails = docType;

export interface MoveDocument {
   source: string,
   destination: string,
}

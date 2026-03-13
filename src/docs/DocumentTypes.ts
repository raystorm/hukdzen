import { Document as DocType } from "../graphql/API";
import { Xbiis } from "../Box/boxTypes";

export type Document = DocType;

export interface MoveDocument {
   source:      string;
   destination: string;
   targetBox:   Xbiis;
}

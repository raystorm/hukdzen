import { Document as DocType } from "../graphql/API";
import { Box } from "../Box/boxTypes";

export type Document = DocType;

export interface MoveDocument {
   source:      string;
   destination: string;
   targetBox:   Box;
}

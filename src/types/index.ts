/* Common Types */

export interface ERROR {
    message: string;
    severity: string;
    rootCause: any; //find Typescript error/exeption type
}
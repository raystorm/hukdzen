import { Action, PayloadAction } from "@reduxjs/toolkit";
import { DocumentDetails } from "../types";
import { ErrorPayloadAction } from ".";

/*
 *  Document Actions this site can perform
 */

export const SELECT_DOCUMENT_ACTION = "SELECT_DOCUMENT";
//TODO: make these extend/implement Action
export const SelectDocument = (details: DocumentDetails) : 
       PayloadAction<DocumentDetails> =>
({
    type: SELECT_DOCUMENT_ACTION,
    payload: details,
});

//TODO: Do I need LOAD, FIND, or RETRIEVE?


export const CREATE_DOCUMENT_REQUESTED_ACTION = "CREATE_DOCUMENT_REQUESTED";
export const createDocumentRequested = (details: DocumentDetails) : 
       PayloadAction<DocumentDetails> =>
({
    type: CREATE_DOCUMENT_REQUESTED_ACTION,
    payload: details,
});

export const CREATE_DOCUMENT_SUCESS_ACTION    = "CREATE_DOCUMENT_SUCCESFUL";
export const createDocumentSucess = (details: DocumentDetails) : 
       PayloadAction<DocumentDetails> =>
({
    type: CREATE_DOCUMENT_SUCESS_ACTION,
    payload: details,
});

export const CREATE_DOCUMENT_ERROR_ACTION     = "CREATE_DOCUMENT_ERRORED";
export const createDocumentError = (details: DocumentDetails, 
                                    message: string) : 
       PayloadAction<DocumentDetails, string, never, string> =>
({
    type: CREATE_DOCUMENT_ERROR_ACTION,
    payload: details,
    error: message,
});



export const UPDATE_DOCUMENT_REQUESTED_ACTION = "UPDATE_DOCUMENT_REQUESTED";
export const updateDocumentRequested = (details: DocumentDetails) : 
       PayloadAction<DocumentDetails> => 
({
    type: UPDATE_DOCUMENT_REQUESTED_ACTION,
    payload: details,
});

export const UPDATE_DOCUMENT_SUCESS_ACTION    = "UPDATE_DOCUMENT_SUCCESFUL";
export const updateDocumentSucess = (details: DocumentDetails) : 
       PayloadAction<DocumentDetails> => 
({
    type: UPDATE_DOCUMENT_SUCESS_ACTION,
    payload: details,
});

export const UPDATE_DOCUMENT_ERROR_ACTION     = "UPDATE_DOCUMENT_ERRORED";
export const updateDocumentError = (details: DocumentDetails, 
                                    message: string) : 
             PayloadAction<DocumentDetails, string, never, string> => 
({
    type: UPDATE_DOCUMENT_ERROR_ACTION,
    payload: details,
    error: message,
});


export const REMOVE_DOCUMENT_REQUESTED_ACTION = "REMOVE_DOCUMENT_REQUESTED";
export const RemoveDocumentRequested = (details: DocumentDetails) :
       PayloadAction<DocumentDetails> => 
({
    type: REMOVE_DOCUMENT_REQUESTED_ACTION,
    payload: details,
});

export const REMOVE_DOCUMENT_SUCESS_ACTION    = "REMOVE_DOCUMENT_SUCCESFUL";
export const RemoveDocumentSucess = (details: DocumentDetails) :
       PayloadAction<DocumentDetails> => 
({
    type: REMOVE_DOCUMENT_SUCESS_ACTION,
    payload: details,
});

export const REMOVE_DOCUMENT_ERROR_ACTION     = "REMOVE_DOCUMENT_ERRORED";
export const RemoveDocumentError = (details: DocumentDetails, 
                                    message: string) : 
       PayloadAction<DocumentDetails, string, never, string> => 
({
    type: REMOVE_DOCUMENT_ERROR_ACTION,
    payload: details,
    error: message,
});


export type DocumentAction = (typeof SelectDocument 
                           | typeof updateDocumentRequested
                           | typeof updateDocumentSucess
                           | typeof updateDocumentError
                           | typeof RemoveDocumentRequested
                           | typeof RemoveDocumentSucess
                           | typeof RemoveDocumentError
);
import { Action, PayloadAction } from "@reduxjs/toolkit";
import { DocumentDetails } from "./DocumentTypes";
import { ErrorPayloadAction } from "../actions";

/*
 *  Document Actions this site can perform
 */

export const SELECT_DOCUMENT_ACTION = "SELECT_DOCUMENT";
//TODO: make these extend/implement Action
export const selectDocument = (details: DocumentDetails) : 
       PayloadAction<DocumentDetails> =>
({
    type: SELECT_DOCUMENT_ACTION,
    payload: details,
});

export const SELECT_DOCUMENT_BY_ID_ACTION = "SELECT_DOCUMENT_BY_ID";
//TODO: make these extend/implement Action
export const selectDocumentById = (id: string) : 
       PayloadAction<string> =>
({
    type: SELECT_DOCUMENT_BY_ID_ACTION,
    payload: id,
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
export const removeDocumentRequested = (details: DocumentDetails) :
       PayloadAction<DocumentDetails> => 
({
    type: REMOVE_DOCUMENT_REQUESTED_ACTION,
    payload: details,
});

export const REMOVE_DOCUMENT_SUCESS_ACTION    = "REMOVE_DOCUMENT_SUCCESFUL";
export const removeDocumentSucess = (details: DocumentDetails) :
       PayloadAction<DocumentDetails> => 
({
    type: REMOVE_DOCUMENT_SUCESS_ACTION,
    payload: details,
});

export const REMOVE_DOCUMENT_ERROR_ACTION     = "REMOVE_DOCUMENT_ERRORED";
export const removeDocumentError = (details: DocumentDetails, 
                                    message: string) : 
       PayloadAction<DocumentDetails, string, never, string> => 
({
    type: REMOVE_DOCUMENT_ERROR_ACTION,
    payload: details,
    error: message,
});


export type DocumentAction =(typeof selectDocument 
                           | typeof selectDocumentById
                           | typeof createDocumentRequested
                           | typeof createDocumentSucess
                           | typeof createDocumentError
                           | typeof updateDocumentRequested
                           | typeof updateDocumentSucess
                           | typeof updateDocumentError
                           | typeof removeDocumentRequested
                           | typeof removeDocumentSucess
                           | typeof removeDocumentError
);

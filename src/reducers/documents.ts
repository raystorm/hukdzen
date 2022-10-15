import { PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '.';
import { 
    DocumentAction,
    SELECT_DOCUMENT_ACTION, 
    UPDATE_DOCUMENT_REQUESTED_ACTION,
    UPDATE_DOCUMENT_SUCESS_ACTION,
    UPDATE_DOCUMENT_ERROR_ACTION,
    REMOVE_DOCUMENT_REQUESTED_ACTION,
    REMOVE_DOCUMENT_SUCESS_ACTION,
    REMOVE_DOCUMENT_ERROR_ACTION,
} from '../actions/document';
import { DocumentDetails } from '../types';

export const documents = (state: ReduxState, action: PayloadAction<DocumentDetails>) => {
    const { type, payload } = action;

    switch(type)
    {
        case SELECT_DOCUMENT_ACTION:
            //LOAD document from ID here, or something and return
            return state; 
        case UPDATE_DOCUMENT_REQUESTED_ACTION:
        case UPDATE_DOCUMENT_SUCESS_ACTION:
        case UPDATE_DOCUMENT_ERROR_ACTION:
        case REMOVE_DOCUMENT_REQUESTED_ACTION:
        case REMOVE_DOCUMENT_SUCESS_ACTION:
        case REMOVE_DOCUMENT_ERROR_ACTION:

        default:  //unknown action no change
            return state;
    }

    return state;
}
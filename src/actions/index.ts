import { PayloadAction } from "@reduxjs/toolkit"
import { type } from "os"


/*
 *  Common actions this web application can perform.
 */

export const ERROR = "Error"
export const ErrorAction = (message: string) : PayloadAction<string, string> => ({
    type: ERROR,
    payload: message
})

//TODO: look at error type
export type ErrorPayloadAction<P> = PayloadAction<P> & { error: string; }




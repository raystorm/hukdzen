export interface Template
{
   subject:      string;
   body:         string;
   requiredArgs: string[];
   validateArgs?: (args: Record<string, any>) => ValidationResult;
}

export interface ValidationResult
{
   valid: boolean;
   error?: string;
}

export interface RenderedEmail
{
   subject: string;
   body:    string;
}

export interface EmailEvent
{
   arguments?:    EmailArgs;
   to?:           string[];
   cc?:           string[];
   templateName?: string;
   templateArgs?: any;
   globalParams?: GlobalParams | string;
}

export interface EmailArgs
{
   to:           string[];
   cc?:          string[];
   templateName: string;
   templateArgs: any;
   globalParams?: GlobalParams | string;
}

export interface GlobalParams
{
   userId?:         string;
   email?:          string;
   unsubscribeUrl?: string;
}

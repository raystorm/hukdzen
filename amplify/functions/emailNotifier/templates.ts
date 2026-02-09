/* Email Templates for Hukdzen Notifications */

import { logger } from '../shared/logger';
import type { Template, ValidationResult, RenderedEmail } from './types';

/**
 * Email template definitions
 * Each template includes:
 * - subject: Email subject line (can use template variables)
 * - body: Email body text (can use template variables)
 * - requiredArgs: Array of required argument names
 * - validateArgs: Optional custom validation function
 */
const templates: Record<string, Template> = {
   BOX_REQUEST_SUBMITTED: {
      subject: 'New Box Request from {requesterName}',
      body: `Ama Sah (Good Day) Admin,

A new box request has been submitted:

   Requester: {requesterName}
   Requested Box Name: {boxName}
   Reason: {reason}

View all requests: {requestListUrl}
View this request: {requestDetailUrl}

Doyackshn (Thank you),
Smalgyax-Files.org Team`,
      requiredArgs: ['requesterName', 'boxName', 'reason', 'requestListUrl', 'requestDetailUrl']
   },

   BOX_REQUEST_APPROVED: {
      subject: 'Your Box Request Has Been Approved',
      body: `Ama Sah (Good Day) {requesterName},

Your box request has been approved.

   Box Name: {boxName}

Your new box is now available for use. You may begin uploading documents to store or to share.

Access your box: {boxUrl}

Doyackshn (Thank you),
Smalgyax-Files.org Team`,
      requiredArgs: ['requesterName', 'boxName', 'boxUrl']
   },

   BOX_REQUEST_DENIED: {
      subject: 'Box Request Update',
      body: `Ama Sah (Good Day) {requesterName},

Thank you for your box request. After review, we are unable to approve your request at this time.

   Requested Box Name: {boxName}
   Reason for Denial: {denialReason}

If you have questions or would like assistance submitting a revised request, please contact an administrator.

Doyackshn (Thank you),
Smalgyax-Files.org Team`,
      requiredArgs: ['requesterName', 'boxName', 'denialReason']
   }
};

/**
 * Validate template arguments
 */
function validateTemplateArgs(templateName: string, args: any): ValidationResult
{
   const template = templates[templateName];
   
   if ( !template )
   { return { valid: false, error: `Unknown template: ${templateName}` }; }

   if ( !args || 'object' !== typeof args )
   { return { valid: false, error: 'Template arguments must be an object' }; }

   for ( const requiredArg of template.requiredArgs )
   {
      if ( !args[requiredArg] )
      {
         return {
            valid: false,
            error: `Missing required argument: ${requiredArg}`
         };
      }

      if ( 'string' !== typeof args[requiredArg] )
      {
         return {
            valid: false,
            error: `Argument ${requiredArg} must be a string`
         };
      }
   }

   if ( template.validateArgs )
   {
      const customValidation = template.validateArgs(args);
      if ( !customValidation.valid ) { return customValidation; }
   }

   return { valid: true };
}

/**
 * Render template with arguments
 */
function renderTemplate(text: string, args: Record<string, string>): string
{
   let rendered = text;
   for ( const [key, value] of Object.entries(args) )
   {
      const placeholder = `{${key}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), value);
   }
   return rendered;
}

/**
 * Get rendered email from template
 */
export function getEmailFromTemplate(templateName: string,
                                     args: Record<string, any>): RenderedEmail
{
   const validation = validateTemplateArgs(templateName, args);
   if ( !validation.valid ) { throw new Error(validation.error); }

   const template = templates[templateName];
   
   return {
      subject: renderTemplate(template.subject, args),
      body: renderTemplate(template.body, args)
   };
}

/**
 * Get list of available template names
 */
export function getAvailableTemplates(): string[] { return Object.keys(templates); }

export { templates, validateTemplateArgs, renderTemplate };

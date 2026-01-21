/* Email Templates for Hukdzen Notifications */

const { logger } = require('./logger.js');

/**
 * Email template definitions
 * Each template includes:
 * - subject: Email subject line (can use template variables)
 * - body: Email body text (can use template variables)
 * - requiredArgs: Array of required argument names
 * - validateArgs: Optional custom validation function
 */
const templates = {
   BOX_REQUEST_SUBMITTED: {
      subject: 'New Box Request from {requesterName}',
      body: `Hello Admin,

A new box request has been submitted:

Requester: {requesterName}
Requested Box Name: {boxName}
Reason: {reason}

View all requests: {requestListUrl}
View this request: {requestDetailUrl}

Thank you,
Smalgyax-Files.org Team`,
      requiredArgs: ['requesterName', 'boxName', 'reason', 'requestListUrl', 'requestDetailUrl']
   },

   BOX_REQUEST_APPROVED: {
      subject: 'Your Box Request Has Been Approved',
      body: `Hello {requesterName},

Great news! Your box request has been approved.

Box Name: {boxName}
Approved By: {approverName}

Your new box is now available and ready to use. You can start uploading documents to organize your Smalgyax language learning materials.

Thank you,
Smalgyax-Files.org Team`,
      requiredArgs: ['requesterName', 'boxName', 'approverName']
   },

   BOX_REQUEST_DENIED: {
      subject: 'Box Request Update',
      body: `Hello {requesterName},

Thank you for your box request. After review, we are unable to approve your request at this time.

Requested Box Name: {boxName}
Reason for Denial: {denialReason}

If you have questions or would like to submit a revised request, please contact an administrator.

Thank you,
Smalgyax-Files.org Team`,
      requiredArgs: ['requesterName', 'boxName', 'denialReason']
   }
};

/**
 * Validate template arguments
 * @param {string} templateName
 * @param {Object} args
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateTemplateArgs(templateName, args)
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
 * @param {string} text - Template text with {variable} placeholders
 * @param {Object} args - Arguments to substitute
 * @returns {string}
 */
function renderTemplate(text, args)
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
 * @param {string} templateName
 * @param {Object} args
 * @returns {Object} { subject: string, body: string } or throws error
 */
function getEmailFromTemplate(templateName, args)
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
 * @returns {string[]}
 */
function getAvailableTemplates() { return Object.keys(templates); }

module.exports = {
   templates,
   validateTemplateArgs,
   getEmailFromTemplate,
   getAvailableTemplates,
   renderTemplate
};

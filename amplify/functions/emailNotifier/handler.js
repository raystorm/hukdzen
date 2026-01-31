const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const jwt = require('jsonwebtoken');
const { logger } = require('./logger.js');
const { getEmailFromTemplate, getAvailableTemplates } = require('./templates.js');

const sesClient = new SESClient({ region: process.env.AWS_REGION });
const amplifyEnv = process.env.ENV;
const configSetName = process.env.CONFIGURATION_SET_NAME;
const isProd = configSetName === 'hukdzen-prod' || amplifyEnv === 'prod';

/**
 *  Simple Email Validation Regex
 *    * Accepts any valid looking email address like 'local@domain.TLD'
 *    * This is purposefully lax because:
 *      * This is a backend Lambda function called programmatically
 *      * SES will perform final/strict validation anyway
 *    * The repeated `[^\\s@]` means "any non-whitespace character except '@'"
 *      * This is used for validating local, domain, and TLD.
 *  @type {RegExp}
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email address format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email)
{ return 'string' === typeof email && EMAIL_REGEX.test(email); }

/**
 * Validate array of email addresses
 * @param {string[]} emails
 * @returns {boolean}
 */
function validateEmails(emails)
{
   if ( !Array.isArray(emails) || 0 === emails.length ) { return false; }
   return emails.every(isValidEmail);
}

/**
 * Email Notifier Lambda
 * Template-based email sending service using AWS SES
 * 
 * @param event.to - Array of recipient email addresses
 * @param event.cc - Optional array of CC email addresses
 * @param event.templateName - Name of email template (e.g., 'BOX_REQUEST_SUBMITTED')
 * @param event.templateArgs - Arguments for template (validated against template requirements)
 * @param event.globalParams - Optional global parameters (e.g., unsubscribeUrl) appended to all emails
 * 
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) =>
{
   if ( !isProd ) { logger.log('EVENT:', event); }

   try
   {
      // AppSync wraps arguments in an 'arguments' field
      const args = event.arguments || event;
      let { to, cc, templateName, templateArgs, globalParams } = args;

      // Parse JSON strings
      if ('string' === typeof templateArgs) { templateArgs = JSON.parse(templateArgs); }
      if ('string' === typeof globalParams) { globalParams = JSON.parse(globalParams); }

      if ( !to || !Array.isArray(to) || 0 === to.length )
      {
         throw new Error('Missing or invalid "to" field - must be non-empty array');
      }

      if ( !validateEmails(to) )
      { throw new Error('Invalid email address format in "to" field'); }

      if ( cc && cc.length > 0 && !validateEmails(cc) )
      { throw new Error('Invalid email address format in "cc" field'); }

      if ( !templateName )
      { throw new Error('templateName is required'); }

      if ( !templateArgs )
      { throw new Error('templateArgs required when using templateName'); }

      const rendered = getEmailFromTemplate(templateName, templateArgs);
      const emailSubject = rendered.subject;
      let emailBody = rendered.body;

      // Generate unsubscribe URL if userId and email provided
      if (globalParams?.userId && globalParams?.email)
      {
         const jwtSecret = process.env.JWT_SECRET;
         if (!jwtSecret) { throw new Error('JWT_SECRET not configured'); }

         const token = jwt.sign(
            { userId: globalParams.userId, email: globalParams.email },
            jwtSecret,
            { expiresIn: '90d' }
         );

         const frontendUrl = isProd 
            ? 'https://smalgyax-files.org' 
            : 'https://dev.smalgyax-files.org';
         const unsubscribeUrl = `${frontendUrl}/unsubscribe?token=${token}`;
         emailBody += `\n\n---\nTo unsubscribe: ${unsubscribeUrl}`;
      }
      // Legacy: direct unsubscribeUrl (deprecated)
      else if (globalParams?.unsubscribeUrl)
      {
         emailBody += `\n\n---\nTo unsubscribe: ${globalParams.unsubscribeUrl}`;
      }

      const senderEmail = process.env.SENDER_EMAIL;
      if ( !senderEmail )
      { throw new Error('SENDER_EMAIL environment variable not configured'); }

      const params = {
         Source: senderEmail,
         Destination: {
            ToAddresses: to,
            ...(cc && cc.length > 0 && { CcAddresses: cc })
         },
         Message: {
            Subject: { Data: emailSubject },
            Body: { Text: { Data: emailBody } }
         },
         ConfigurationSetName: process.env.CONFIGURATION_SET_NAME || `hukdzen-${amplifyEnv}`
      };

      if ( !isProd )
      {
         //logger.log('Sending email with params:', JSON.stringify(params, null, 2));
         logger.log('Sending email with params:', {
                      from: senderEmail, to: to, cc: cc,
                      templateName: templateName, templateArgs: templateArgs,
                    });
      }

      const command = new SendEmailCommand(params);
      const response = await sesClient.send(command);

      logger.log('Email sent successfully:', response.MessageId);
      return {
         statusCode: 200,
         body: JSON.stringify({
            message: 'Email sent successfully',
            messageId: response.MessageId
         })
      };
   }
   catch (error)
   {
      logger.error('Error sending email:', error);
      throw error;
   }
};

exports.isValidEmail = isValidEmail;
exports.validateEmails = validateEmails;
exports.getAvailableTemplates = getAvailableTemplates;

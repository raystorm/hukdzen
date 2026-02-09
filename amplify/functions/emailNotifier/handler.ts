import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import jwt from 'jsonwebtoken';
import { logger } from '../shared/logger';
import { getEmailFromTemplate, getAvailableTemplates } from './templates';
import type { EmailEvent, GlobalParams } from './types';

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
 */
function isValidEmail(email: string): boolean
{ return EMAIL_REGEX.test(email); }

/**
 * Validate array of email addresses
 */
function validateEmails(emails: string[]): boolean
{
   if ( !Array.isArray(emails) || 0 === emails.length ) { return false; }
   return emails.every(isValidEmail);
}

/**
 * Email Notifier Lambda
 * Template-based email sending service using AWS SES
 */
export const handler = async (event: EmailEvent):
       Promise<{ statusCode: number; body: string }> =>
{
   if ( !isProd ) { logger.log('EVENT:', event); }

   try
   {
      // AppSync wraps arguments in an 'arguments' field
      const args = event.arguments || event;
      let { to, cc, templateName, templateArgs, globalParams } = args;

      // Parse JSON strings
      let global: GlobalParams | undefined;
      if ('string' === typeof templateArgs) { templateArgs = JSON.parse(templateArgs); }
      if ('string' === typeof globalParams) { global = JSON.parse(globalParams); }
      if ( !global ) { global = globalParams as GlobalParams; }

      if ( !to || !Array.isArray(to) || 0 === to.length )
      { throw new Error('Missing or invalid "to" field - must be non-empty array'); }

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
      if (global?.userId && global?.email)
      {
         const jwtSecret = process.env.JWT_SECRET;
         if (!jwtSecret) { throw new Error('JWT_SECRET not configured'); }

         const token = jwt.sign({ userId: global.userId, email: global.email },
                                jwtSecret, { expiresIn: '90d' }
         );

         const frontendUrl = isProd 
            ? 'https://smalgyax-files.org' 
            : 'https://dev.smalgyax-files.org';
         const unsubscribeUrl = `${frontendUrl}/unsubscribe?token=${token}`;
         emailBody += `\n\n---\nTo unsubscribe: ${unsubscribeUrl}`;
      }
      // Legacy: direct unsubscribeUrl (deprecated)
      else if (global?.unsubscribeUrl)
      { emailBody += `\n\n---\nTo unsubscribe: ${global.unsubscribeUrl}`; }

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

export { isValidEmail, validateEmails, getAvailableTemplates };

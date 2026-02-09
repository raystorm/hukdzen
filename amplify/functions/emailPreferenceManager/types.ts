import type { EmailPreferences, User } from '../../../src/types/AmplifyTypes';
import  { OptOutReason } from '../../../src/types/AmplifyTypes';

export { OptOutReason };
export type { User, EmailPreferences };

/*
export enum OptOutReason
{
   BOUNCE_HARD = 'BOUNCE_HARD',
   BOUNCE_SOFT = 'BOUNCE_SOFT',
   COMPLAINT   = 'COMPLAINT',
   USER_CHOICE = 'USER_CHOICE'
}

export interface EmailPreferences
{
   allOptOut?:          boolean;
   boxRequestOptOut?:   boolean;
   collaboratorOptOut?: boolean;
   systemOptOut?:       boolean;
   softBounceCount?:    number;
   optOutReason?:       OptOutReason;
   optOutAt?:           string;
}

export interface User
{
   id:                string;
   email:             string;
   emailPreferences?: EmailPreferences;
}
*/

export interface SnsEvent
{
   Records: Array<{ Sns: { Message: string; }; }>;
}

export interface SesMessage
{
   eventType:  'Bounce' | 'Complaint';
   bounce?:    BounceInfo;
   complaint?: ComplaintInfo;
}

export interface BounceInfo
{
   bounceType:        'Permanent' | 'Transient';
   bouncedRecipients: Recipient[];
}

export interface ComplaintInfo
{
   complainedRecipients: Recipient[];
}

export interface Recipient
{
   emailAddress: string;
}

export interface AppSyncEvent
{
   info?:      { fieldName: string };
   arguments?: {
      email?:       string;
      token?:       string;
      preferences?: EmailPreferences;
   };
}

export type HandlerEvent = SnsEvent | AppSyncEvent;

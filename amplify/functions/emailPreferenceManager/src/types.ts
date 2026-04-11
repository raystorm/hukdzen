import type { EmailPreferences, User } from '../../shared/types/index';
import  { OptOutReason } from '../../shared/types/index';

export { OptOutReason };
export type { User, EmailPreferences };

export interface SnsEvent { Records: Array<{ Sns: { Message: string; }; }>; }

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

export interface ComplaintInfo { complainedRecipients: Recipient[]; }

export interface Recipient { emailAddress: string; }

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

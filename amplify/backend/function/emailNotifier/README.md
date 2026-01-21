# Email Notifier Lambda Function

Generic email notification service using AWS SES.

## Overview

This Lambda function provides a simple "send and forget" email service.
It accepts email parameters and sends emails via AWS SES.

## Setup Instructions

### 1. Deploy the Lambda Function

```bash
amplify push
```

### 2. Configure AWS SES (One-time setup)

#### Verify Sender Email Address
1. Open [AWS SES Console](https://console.aws.amazon.com/ses/)
2. Navigate to **Verified identities**
3. Click **Create identity**
4. Select **Email address**
5. Enter: `noreply@Smalgyax-Files.Org` (or your chosen sender email)
6. Click **Create identity**
7. Check your email and click the verification link

#### Request Production Access (Optional, for >200 emails/day)
1. In SES Console, navigate to **Account dashboard**
2. Click **Request production access**
3. Fill out the form explaining your use case
4. Wait for AWS approval (usually 24-48 hours)

**Note:** Until production access is granted, you can only send emails to verified addresses.

### 3. Update Sender Email (if different from default)

Edit `amplify/backend/function/emailNotifier/parameters.json`:
```json
{
  "senderEmail": "your-verified-email@yourdomain.com"
}
```

Then run `amplify push` to update.

## Usage

### Template-Based Emails (Only Mode)

All emails must use predefined templates with validated arguments:

```javascript
const payload = {
   to: ['admin@example.com'],
   templateName: 'BOX_REQUEST_SUBMITTED',
   templateArgs: {
      requesterName: 'John Doe',
      boxName: 'My Documents',
      reason: 'Need storage for language materials',
      dashboardUrl: 'https://smalgyax-files.org/admin/requests/123'
   }
};
```

**Available Templates:**
- `BOX_REQUEST_SUBMITTED` - Notify admins of new box request
- `BOX_REQUEST_APPROVED` - Notify user their request was approved
- `BOX_REQUEST_DENIED` - Notify user their request was denied

### Invoke from Another Lambda

```javascript
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

const payload = {
   to: ['user@example.com'],
   cc: ['admin@example.com'], // Optional
   subject: 'Your Box Request Was Approved',
   body: 'Congratulations! Your box request has been approved.',
   isHtml: false // Optional, default: false
};

const command = new InvokeCommand({
   FunctionName: `emailNotifier-${process.env.ENV}`,
   InvocationType: 'Event', // Async invocation (fire and forget)
   Payload: JSON.stringify(payload)
});

await lambdaClient.send(command);
```

### Invoke from Redux Saga

```javascript
import { call } from 'redux-saga/effects';
import { Lambda } from 'aws-amplify';

function* sendEmailSaga(emailParams) {
   try {
      yield call([Lambda, 'invoke'], {
         functionName: 'emailNotifier',
         invocationType: 'Event',
         payload: emailParams
      });
   } catch (error) {
      console.error('Failed to send email:', error);
   }
}
```

## Email Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `to` | string[] | Yes | Array of recipient email addresses |
| `cc` | string[] | No | Array of CC email addresses |
| `templateName` | string | Yes | Name of email template |
| `templateArgs` | object | Yes | Arguments for template (validated) |

## Examples

### Plain Text Email
```javascript
{
   to: ['user@example.com'],
   subject: 'Welcome to Hukdzen',
   body: 'Thank you for joining our language learning community!'
}
```

### HTML Email
```javascript
{
   to: ['user@example.com'],
   subject: 'Box Request Approved',
   body: '<h1>Approved!</h1><p>Your box <strong>My Documents</strong> is ready.</p>',
   isHtml: true
}
```

### Multiple Recipients with CC
```javascript
{
   to: ['user1@example.com', 'user2@example.com'],
   cc: ['admin@example.com'],
   subject: 'Team Notification',
   body: 'You have been added as collaborators to a new box.'
}
```

## Monitoring

View logs in CloudWatch:
```bash
aws logs tail /aws/lambda/emailNotifier-dev --follow
```

## Cost

- **Free tier**: 62,000 emails/month (permanent, when invoked from Lambda)
- **After free tier**: $0.10 per 1,000 emails

## Troubleshooting

### Email not received
1. Check CloudWatch logs for errors
2. Verify sender email is verified in SES
3. If in sandbox mode, verify recipient email is also verified
4. Check spam folder

### "Email address not verified" error
- Verify both sender and recipient emails in SES Console (if in sandbox mode)
- Or request production access to send to any email

### Permission denied error
- Ensure Lambda execution role has SES permissions (automatically configured)

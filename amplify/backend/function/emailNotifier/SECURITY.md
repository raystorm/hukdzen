# Email Notifier Security

## Security Measures

### 1. Email Validation
- Validates email format using regex before sending
- Rejects invalid email addresses in both `to` and `cc` fields
- Prevents malformed email injection

### 2. Invocation Security

**Current State**: Lambda can be invoked by any authenticated AWS user in the account.

**Recommended Restrictions**:

#### Option A: Restrict to Specific Lambda Functions (Recommended)
Only allow other Lambda functions (like sagas) to invoke emailNotifier:

```json
{
  "Effect": "Allow",
  "Principal": {
    "Service": "lambda.amazonaws.com"
  },
  "Action": "lambda:InvokeFunction",
  "Resource": "arn:aws:lambda:REGION:ACCOUNT:function:emailNotifier-ENV",
  "Condition": {
    "ArnLike": {
      "AWS:SourceArn": "arn:aws:lambda:REGION:ACCOUNT:function:*"
    }
  }
}
```

#### Option B: Restrict to Specific IAM Roles
Only allow specific execution roles to invoke:

```json
{
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::ACCOUNT:role/amplify-execution-role"
  },
  "Action": "lambda:InvokeFunction",
  "Resource": "arn:aws:lambda:REGION:ACCOUNT:function:emailNotifier-ENV"
}
```

#### Option C: API Gateway Integration (Future)
Expose via API Gateway with Cognito authentication for frontend invocation.

### 3. Rate Limiting
**SES Limits** (automatic):
- Sandbox: 200 emails/day, 1 email/second
- Production: 50,000 emails/day (can request increase)

**Lambda Limits** (automatic):
- Concurrent executions: 1000 (account-level)
- Can set reserved concurrency on emailNotifier to prevent abuse

### 4. Content Validation
- **Template-Only Mode**: All emails must use predefined templates
  - Only approved templates can be used
  - Arguments validated against template requirements
  - Prevents arbitrary email content
  - Eliminates spam/abuse potential
- SES handles email encoding

### 5. Logging
- All invocations logged to CloudWatch
- Email parameters logged in non-prod environments
- Errors logged with full context

## Implementation Status

✅ Email validation
✅ Logger integration  
✅ Input validation
✅ Template system with argument validation
✅ Predefined templates for box requests
⚠️ Invocation restrictions (requires manual IAM policy or API Gateway)
⚠️ Rate limiting (relies on SES/Lambda defaults)

## Recommended Next Steps

1. **For saga-only invocation**: Add resource-based policy restricting to Lambda service
2. **For frontend invocation**: Create API Gateway endpoint with Cognito auth
3. **For high-volume**: Set reserved concurrency limit on emailNotifier
4. **For monitoring**: Set up CloudWatch alarms on invocation count

## Current Risk Assessment

**Risk**: Low
- Template-only mode eliminates spam/abuse potential
- Only predefined templates with validated arguments
- No arbitrary email content possible
- Anyone with AWS credentials in the account can still invoke (but limited to templates)
- Limited by SES sending limits
- All invocations are logged

**Mitigation**: 
- **Template-only enforcement provides strong security**
- Deploy with Option A (Lambda-only invocation) for additional protection
- Monitor CloudWatch logs for unexpected invocations
- SES sandbox mode limits blast radius during development

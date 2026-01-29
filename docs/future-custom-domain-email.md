# Future Enhancement: Custom Domain Email

## Goal
Receive and send emails as `admin@smalgyax-files.org` instead of `Personal@Example.com`

## Current State
- Sending: Using `noreply@smalgyax-files.org` via SES (working)
- Receiving: Not configured
- Replying: Must use personal Outlook address

## Desired State
- Receive emails at `admin@smalgyax-files.org`
- Reply to users as `admin@smalgyax-files.org`
- Professional appearance for users

## Solution Options

### Option 1: SES Receive + Lambda Forward (Free)
**Cost:** $0/month (within free tier)

**Setup:**
1. S3 bucket stores incoming emails
2. Lambda function forwards to Outlook
3. Reply from Outlook (shows as Tom.Burton@Outlook.com)

**Pros:**
- Free
- Simple setup
- Uses existing SES

**Cons:**
- Can't reply as domain address
- Manual Lambda maintenance

### Option 2: SES Receive + WorkMail ($4/month)
**Cost:** $4/user/month

**Setup:**
1. Enable AWS WorkMail
2. Create `admin@smalgyax-files.org` mailbox
3. Access via web or IMAP

**Pros:**
- Full email client
- Reply as domain address
- Professional

**Cons:**
- $4/month cost
- Another service to manage

### Option 3: SES Receive + Gmail/Outlook SMTP ($0/month)
**Cost:** Free

**Setup:**
1. SES receives emails → S3
2. Lambda forwards to Gmail/Outlook
3. Configure Gmail/Outlook to send via SES SMTP
4. Reply as `admin@smalgyax-files.org`

**Pros:**
- Free
- Use familiar email client
- Reply as domain address

**Cons:**
- Complex SMTP setup
- Gmail/Outlook may flag as spam

### Option 4: Third-Party Email Forwarding
**Services:** ImprovMX, ForwardEmail.net
**Cost:** $0-3/month

**Pros:**
- Simple setup
- Some support reply-as-domain
- No AWS complexity

**Cons:**
- Another service dependency
- May have limitations

## Recommended Approach

**Phase 1 (Now):** Keep using `Personal@Example.com` for alerts
**Phase 2 (Post-Migration):** Implement Option 3 (SES + Gmail SMTP)
**Phase 3 (If budget allows):** Upgrade to WorkMail for full professional email

## Implementation Steps (Option 3)

### 1. Setup SES Email Receiving
```bash
cd gen2-infrastructure
./setup-email-forwarding.sh
```

### 2. Add MX Record to DNS
```
Type: MX
Name: @
Value: 10 inbound-smtp.us-west-2.amazonaws.com
Priority: 10
```

### 3. Create Lambda Forwarder
```javascript
// Lambda forwards S3 emails to Gmail/Outlook
exports.handler = async (event) => {
   const s3Object = event.Records[0].s3.object.key;
   const email = await s3.getObject({Bucket, Key: s3Object});
   
   // Forward to Gmail
   await ses.sendRawEmail({
      Destinations: ['Personal@Example.com'],
      RawMessage: { Data: email.Body }
   });
};
```

### 4. Configure Gmail/Outlook SMTP
**Gmail Settings:**
- Settings → Accounts → Send mail as
- Add: `admin@smalgyax-files.org`
- SMTP Server: `email-smtp.us-west-2.amazonaws.com`
- Port: 587
- Username: (SES SMTP credentials)
- Password: (SES SMTP credentials)

**Result:** Receive at domain, reply as domain, all in Gmail

## Cost Comparison

| Option                 | Monthly Cost | Reply as Domain | Complexity  |
|------------------------|--------------|-----------------|-------------|
| Option 1 (Lambda)      | $0            | ❌ No          | Low         |
| Option 2 (WorkMail)    | $4            | ✅ Yes         | Low         |
| Option 3 (Gmail SMTP)  | $0            | ✅ Yes         | Medium      |
| Option 4 (Third-party) | $0-3          | ⚠️ Maybe       | Low         |

## Decision Criteria

**Choose Option 1 if:**
- Budget is critical
- Don't need to reply as domain
- Just need to receive alerts

**Choose Option 2 if:**
- Have $4/month budget
- Want professional email
- Want simple management

**Choose Option 3 if:**
- Want free solution
- Need to reply as domain
- Comfortable with technical setup

## Timeline

**Not urgent** - Can implement after Gen 2 migration is complete and stable.

**Estimated effort:** 2-4 hours for Option 3

## Related Issues

- Gen 2 migration must preserve SES sending capability
- Domain verification must remain active
- DKIM/SPF records already configured for sending

## Notes

- Current setup works fine for automated emails
- Personal replies from Outlook are acceptable for now
- Professional domain email is "nice to have" not "must have"
- Can revisit after cost savings from Gen 2 migration are realized

## References

- [AWS SES Email Receiving](https://docs.aws.amazon.com/ses/latest/dg/receiving-email.html)
- [Gmail Send Mail As](https://support.google.com/mail/answer/22370)
- [SES SMTP Credentials](https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html)

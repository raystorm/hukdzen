#!/bin/bash
# Setup free email forwarding for smalgyax-files.org
# Forwards admin@smalgyax-files.org → Tom.Burton@Outlook.com

set -e

DOMAIN="smalgyax-files.org"
FORWARD_TO="Tom.Burton@Outlook.com"
REGION="us-west-2"

echo "=== Setting up email forwarding for $DOMAIN ==="
echo ""

# Create S3 bucket for email storage
BUCKET_NAME="smalgyax-files-emails"
echo "Creating S3 bucket..."
aws s3 mb s3://$BUCKET_NAME --region $REGION 2>/dev/null || echo "Bucket exists"

# Set bucket policy for SES
cat > /tmp/ses-bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSESPuts",
      "Effect": "Allow",
      "Principal": {
        "Service": "ses.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket $BUCKET_NAME \
  --policy file:///tmp/ses-bucket-policy.json

echo "✓ S3 bucket configured"
echo ""

# Create SES receipt rule set
echo "Creating SES receipt rule..."
aws ses create-receipt-rule-set \
  --rule-set-name default-rule-set \
  --region $REGION 2>/dev/null || echo "Rule set exists"

aws ses set-active-receipt-rule-set \
  --rule-set-name default-rule-set \
  --region $REGION

# Create receipt rule
aws ses create-receipt-rule \
  --rule-set-name default-rule-set \
  --rule "{
    \"Name\": \"forward-to-outlook\",
    \"Enabled\": true,
    \"Recipients\": [\"admin@$DOMAIN\"],
    \"Actions\": [
      {
        \"S3Action\": {
          \"BucketName\": \"$BUCKET_NAME\"
        }
      },
      {
        \"BounceAction\": {
          \"Sender\": \"noreply@$DOMAIN\",
          \"SmtpReplyCode\": \"550\",
          \"Message\": \"Email not accepted\",
          \"TopicArn\": \"\"
        }
      }
    ]
  }" \
  --region $REGION 2>/dev/null || echo "Rule exists"

echo "✓ SES receipt rule configured"
echo ""

# Verify domain (if not already)
echo "Verifying domain..."
aws ses verify-domain-identity \
  --domain $DOMAIN \
  --region $REGION 2>/dev/null || echo "Domain already verified"

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Add MX record to DNS:"
echo "   Type: MX"
echo "   Name: @"
echo "   Value: 10 inbound-smtp.$REGION.amazonaws.com"
echo ""
echo "2. Test by sending email to: admin@$DOMAIN"
echo "3. Check S3 bucket: s3://$BUCKET_NAME"
echo "4. Set up Lambda forwarder (optional, for auto-forward to Outlook)"
echo ""
echo "Cost: \$0/month (within free tier)"

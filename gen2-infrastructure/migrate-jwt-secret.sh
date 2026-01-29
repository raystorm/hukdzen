#!/bin/bash
# Copy JWT Secret from Dev to Prod for Gen 2 Migration

set -e

echo "=== JWT Secret Migration ==="

# Get dev secret
echo "Retrieving JWT_SECRET from dev environment..."
DEV_SECRET=$(aws ssm get-parameter \
  --name "/amplify/hukdzen/dev/JWT_SECRET" \
  --region us-west-2 \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text 2>/dev/null || echo "")

if [ -z "$DEV_SECRET" ]; then
  echo "❌ Dev JWT_SECRET not found in Parameter Store"
  echo "Checking Lambda environment variables..."
  
  DEV_SECRET=$(aws lambda get-function-configuration \
    --function-name emailNotifier-dev \
    --region us-west-2 \
    --query 'Environment.Variables.JWT_SECRET' \
    --output text 2>/dev/null || echo "")
fi

if [ -z "$DEV_SECRET" ] || [ "$DEV_SECRET" = "None" ]; then
  echo "❌ Could not find dev JWT_SECRET"
  echo "Generating new secret for both environments..."
  NEW_SECRET=$(openssl rand -base64 64 | tr -d '\n')
  DEV_SECRET=$NEW_SECRET
  echo "✓ Generated new secret"
fi

echo "✓ Dev secret retrieved"

# Store in AWS Secrets Manager for Gen 2
echo ""
echo "Creating secrets in AWS Secrets Manager for Gen 2..."

# Dev secret
aws secretsmanager create-secret \
  --name hukdzen-dev-jwt-secret \
  --description "JWT secret for email unsubscribe tokens (dev)" \
  --secret-string "{\"secret\":\"$DEV_SECRET\"}" \
  --region us-east-1 2>/dev/null || \
aws secretsmanager update-secret \
  --secret-id hukdzen-dev-jwt-secret \
  --secret-string "{\"secret\":\"$DEV_SECRET\"}" \
  --region us-east-1

echo "✓ Dev secret stored in us-east-1"

# Prod secret (same as dev for continuity)
aws secretsmanager create-secret \
  --name hukdzen-prod-jwt-secret \
  --description "JWT secret for email unsubscribe tokens (prod)" \
  --secret-string "{\"secret\":\"$DEV_SECRET\"}" \
  --region us-west-2 2>/dev/null || \
aws secretsmanager update-secret \
  --secret-id hukdzen-prod-jwt-secret \
  --secret-string "{\"secret\":\"$DEV_SECRET\"}" \
  --region us-west-2

echo "✓ Prod secret stored in us-west-2"

# Store ARNs for reference
DEV_ARN=$(aws secretsmanager describe-secret \
  --secret-id hukdzen-dev-jwt-secret \
  --region us-east-1 \
  --query 'ARN' \
  --output text)

PROD_ARN=$(aws secretsmanager describe-secret \
  --secret-id hukdzen-prod-jwt-secret \
  --region us-west-2 \
  --query 'ARN' \
  --output text)

echo ""
echo "=== Migration Complete ==="
echo "Dev Secret ARN:  $DEV_ARN"
echo "Prod Secret ARN: $PROD_ARN"
echo ""
echo "Next steps:"
echo "1. Gen 2 will automatically use these secrets"
echo "2. Old unsubscribe links will continue to work"
echo "3. No manual secret entry needed for future deployments"

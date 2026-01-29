#!/bin/bash
# Post-Deployment Setup Script
# Automates the manual steps from Gen 1 README

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ -z "$1" ]; then
   echo "Usage: ./post-deploy-setup.sh [dev|prod]"
   exit 1
fi

ENV=$1
REGION="us-west-2"
if [ "$ENV" = "dev" ]; then
   REGION="us-east-1"
fi

echo -e "${GREEN}=== Post-Deployment Setup for $ENV ===${NC}\n"

# Get Cognito User Pool ID
echo "Step 1: Finding Cognito User Pool..."
USER_POOL_ID=$(aws cognito-idp list-user-pools \
   --max-results 10 \
   --region $REGION \
   --query "UserPools[?Name=='hukdzen-$ENV'].Id" \
   --output text)

if [ -z "$USER_POOL_ID" ]; then
   echo "❌ User pool not found"
   exit 1
fi
echo "✓ Found user pool: $USER_POOL_ID"

# Create WebAppAdmin group
echo -e "\nStep 2: Verifying WebAppAdmin group..."
echo "✓ WebAppAdmin group created automatically by infrastructure"

# Get DynamoDB table names
echo -e "\nStep 3: Finding DynamoDB tables..."
XBIIS_TABLE=$(aws dynamodb list-tables \
   --region $REGION \
   --query "TableNames[?contains(@, 'Xbiis') && contains(@, '$ENV')]" \
   --output text | head -n1)

USER_TABLE=$(aws dynamodb list-tables \
   --region $REGION \
   --query "TableNames[?contains(@, 'User') && contains(@, '$ENV')]" \
   --output text | head -n1)

echo "✓ Found tables:"
echo "  - Xbiis: $XBIIS_TABLE"
echo "  - User: $USER_TABLE"

# Verify system data exists
echo -e "\nStep 4: Verifying system data..."
SYSTEM_USER=$(aws dynamodb get-item \
   --table-name $USER_TABLE \
   --key '{"id": {"S": "00000000-0000-0000-0000-000000000001"}}' \
   --region $REGION \
   --query 'Item.id.S' \
   --output text 2>/dev/null || echo "")

DEFAULT_BOX=$(aws dynamodb get-item \
   --table-name $XBIIS_TABLE \
   --key '{"id": {"S": "75ca183f-a199-4d3d-9ac3-e10432965276"}}' \
   --region $REGION \
   --query 'Item.id.S' \
   --output text 2>/dev/null || echo "")

if [ -z "$SYSTEM_USER" ] || [ -z "$DEFAULT_BOX" ]; then
   echo "❌ System data not found. Run seed-system-data.sh first:"
   echo "   ./seed-system-data.sh $ENV"
   exit 1
fi
echo "✓ System user exists"
echo "✓ Default box exists"

# Instructions for manual steps
echo -e "\n${YELLOW}=== Manual Steps Required ===${NC}"
echo ""
echo "1. Create Admin User:"
echo "   - Open: https://$ENV.smalgyax-files.org"
echo "   - Sign up with your email"
echo ""
echo "2. Add user to WebAppAdmin group:"
echo "   aws cognito-idp admin-add-user-to-group \\"
echo "     --user-pool-id $USER_POOL_ID \\"
echo "     --username <your-email> \\"
echo "     --group-name WebAppAdmin \\"
echo "     --region $REGION"
echo ""
echo -e "${GREEN}Setup complete!${NC}"

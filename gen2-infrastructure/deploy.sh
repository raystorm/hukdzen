#!/bin/bash
# Automated Gen 2 Deployment Script

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Hukdzen Gen 2 Migration Deployment ===${NC}\n"

# Check environment
if [ -z "$1" ]; then
   echo -e "${RED}Error: Environment not specified${NC}"
   echo "Usage: ./deploy.sh [dev|prod]"
   exit 1
fi

ENV=$1
REGION=""
ALERT_EMAIL=""
SES_FROM_EMAIL="noreply@smalgyax-files.org"

# Set region based on environment
if [ "$ENV" = "dev" ]; then
   REGION="us-east-1"
   ALERT_EMAIL="${ALERT_EMAIL:-admin@hukdzen.com}"
   echo -e "${YELLOW}Deploying DEV environment to us-east-1${NC}"
elif [ "$ENV" = "prod" ]; then
   REGION="us-west-2"
   ALERT_EMAIL="${ALERT_EMAIL:-admin@hukdzen.com}"
   echo -e "${YELLOW}Deploying PROD environment to us-west-2${NC}"
else
   echo -e "${RED}Error: Invalid environment. Use 'dev' or 'prod'${NC}"
   exit 1
fi

# Verify AWS credentials
echo -e "\n${GREEN}Step 1: Verifying AWS credentials...${NC}"
aws sts get-caller-identity --region $REGION > /dev/null 2>&1
if [ $? -eq 0 ]; then
   echo -e "${GREEN}✓ AWS credentials verified${NC}"
else
   echo -e "${RED}✗ AWS credentials not configured${NC}"
   exit 1
fi

# Verify SES configuration (only for prod, uses us-west-2)
if [ "$ENV" = "prod" ]; then
   echo -e "\n${GREEN}Step 2: Verifying SES configuration...${NC}"
   aws ses get-account-sending-enabled --region us-west-2 > /dev/null 2>&1
   if [ $? -eq 0 ]; then
      echo -e "${GREEN}✓ SES configured in us-west-2${NC}"
   else
      echo -e "${YELLOW}⚠ SES not configured. Email notifications will not work.${NC}"
   fi
fi

# Install dependencies
echo -e "\n${GREEN}Step 3: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Set environment variables
export AMPLIFY_ENV=$ENV
export AWS_REGION=$REGION
export ALERT_EMAIL=$ALERT_EMAIL
export SES_FROM_EMAIL=$SES_FROM_EMAIL

# Deploy infrastructure
echo -e "\n${GREEN}Step 4: Deploying Amplify Gen 2 infrastructure...${NC}"
echo -e "${YELLOW}This will create:${NC}"
echo "  - OpenSearch Serverless collection"
echo "  - Cost monitoring alarms"
echo "  - Lambda functions"
echo "  - AppSync API"
echo "  - CloudWatch dashboard"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
   echo -e "${RED}Deployment cancelled${NC}"
   exit 1
fi

npx ampx sandbox --region $REGION

# Get outputs
echo -e "\n${GREEN}Step 5: Retrieving deployment outputs...${NC}"
OPENSEARCH_ENDPOINT=$(aws cloudformation describe-stacks \
   --stack-name amplify-hukdzen-$ENV-monitoring-stack \
   --region $REGION \
   --query 'Stacks[0].Outputs[?OutputKey==`OpenSearchEndpoint`].OutputValue' \
   --output text)

DASHBOARD_URL=$(aws cloudformation describe-stacks \
   --stack-name amplify-hukdzen-$ENV-monitoring-stack \
   --region $REGION \
   --query 'Stacks[0].Outputs[?OutputKey==`DashboardUrl`].OutputValue' \
   --output text)

echo -e "${GREEN}✓ Deployment complete!${NC}\n"

# Display outputs
echo -e "${GREEN}=== Deployment Summary ===${NC}"
echo -e "Environment: ${YELLOW}$ENV${NC}"
echo -e "Region: ${YELLOW}$REGION${NC}"
echo -e "OpenSearch Endpoint: ${YELLOW}$OPENSEARCH_ENDPOINT${NC}"
echo -e "CloudWatch Dashboard: ${YELLOW}$DASHBOARD_URL${NC}"
echo -e "Alert Email: ${YELLOW}$ALERT_EMAIL${NC}"
echo ""

# Next steps
echo -e "${GREEN}=== Next Steps ===${NC}"
if [ "$ENV" = "prod" ]; then
   echo "1. Verify OpenSearch Serverless collection is accessible"
   echo "2. Run reindex script to migrate existing documents"
   echo "3. Test search functionality"
   echo "4. Monitor costs in CloudWatch dashboard"
   echo "5. Update client configuration with new API endpoint"
   echo "6. Run parallel testing for 1 week"
   echo "7. Cutover production traffic"
else
   echo "1. Seed test data: npm run seed:dev"
   echo "2. Test all functionality"
   echo "3. Monitor costs in CloudWatch dashboard"
fi

echo -e "\n${GREEN}Deployment script completed successfully!${NC}"

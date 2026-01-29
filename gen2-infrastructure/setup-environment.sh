#!/bin/bash
# Complete Environment Setup - Run once per environment
# Combines deploy, seed, and post-setup into one command

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ -z "$1" ]; then
   echo "Usage: npm run setup:dev  OR  npm run setup:prod"
   exit 1
fi

ENV=$1
REGION="us-west-2"
if [ "$ENV" = "dev" ]; then
   REGION="us-east-1"
fi

echo -e "${GREEN}=== Hukdzen Gen 2 Environment Setup: $ENV ===${NC}\n"

# Step 1: Deploy infrastructure
echo -e "${GREEN}Step 1: Deploying infrastructure...${NC}"
./deploy.sh $ENV

# Step 2: Seed system data
echo -e "\n${GREEN}Step 2: Seeding system data...${NC}"
./seed-system-data.sh $ENV

# Step 3: Verify and show manual steps
echo -e "\n${GREEN}Step 3: Verifying setup...${NC}"
./post-deploy-setup.sh $ENV

echo -e "\n${GREEN}=== Environment Setup Complete ===${NC}"
echo -e "Next: Follow the manual steps above to create your admin user"

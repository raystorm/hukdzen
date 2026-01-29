#!/bin/bash
# Seed System Account and Default Box
# Eliminates manual DynamoDB editing

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ -z "$1" ]; then
   echo "Usage: ./seed-system-data.sh [dev|prod]"
   exit 1
fi

ENV=$1
REGION="us-west-2"
if [ "$ENV" = "dev" ]; then
   REGION="us-east-1"
fi

echo -e "${GREEN}=== Seeding System Data for $ENV ===${NC}\n"

# Fixed IDs (same across all environments)
SYSTEM_USER_ID="00000000-0000-0000-0000-000000000001"
DEFAULT_BOX_ID="75ca183f-a199-4d3d-9ac3-e10432965276"

# Find DynamoDB tables
echo "Finding DynamoDB tables..."
USER_TABLE=$(aws dynamodb list-tables \
   --region $REGION \
   --query "TableNames[?contains(@, 'User') && contains(@, '$ENV')]" \
   --output text | head -n1)

XBIIS_TABLE=$(aws dynamodb list-tables \
   --region $REGION \
   --query "TableNames[?contains(@, 'Xbiis') && contains(@, '$ENV')]" \
   --output text | head -n1)

echo "✓ Found tables:"
echo "  - User: $USER_TABLE"
echo "  - Xbiis: $XBIIS_TABLE"

# Create System User
echo -e "\nCreating System user..."

aws dynamodb put-item \
   --table-name $USER_TABLE \
   --region $REGION \
   --item "{
      \"id\": {\"S\": \"$SYSTEM_USER_ID\"},
      \"__typename\": {\"S\": \"User\"},
      \"name\": {\"S\": \"System\"},
      \"email\": {\"S\": \"noreply@smalgyax-files.org\"},
      \"isAdmin\": {\"BOOL\": false},
      \"createdAt\": {\"S\": \"2023-06-23T01:13:51.459Z\"},
      \"updatedAt\": {\"S\": \"2023-06-23T01:13:51.459Z\"}
   }" \
   --condition-expression "attribute_not_exists(id)" 2>/dev/null || echo "  (System user already exists)"

echo "✓ System user ready: $SYSTEM_USER_ID"

# Create Default Box
echo -e "\nCreating Default (Public) box..."

aws dynamodb put-item \
   --table-name $XBIIS_TABLE \
   --region $REGION \
   --item "{
      \"id\": {\"S\": \"$DEFAULT_BOX_ID\"},
      \"__typename\": {\"S\": \"Xbiis\"},
      \"name\": {\"S\": \"Public\"},
      \"waa\": {\"S\": \"Nlip 'gynnm\"},
      \"xbiisOwnerId\": {\"S\": \"$SYSTEM_USER_ID\"},
      \"purpose\": {\"S\": \"DEFAULT\"},
      \"defaultRole\": {\"S\": \"WRITE\"},
      \"createdAt\": {\"S\": \"2023-06-23T01:13:51.459Z\"},
      \"updatedAt\": {\"S\": \"2023-07-23T19:37:01.255Z\"}
   }" \
   --condition-expression "attribute_not_exists(id)" 2>/dev/null || echo "  (Default box already exists)"

echo "✓ Default box ready: $DEFAULT_BOX_ID"

echo -e "\n${GREEN}=== System Data Seeded ===${NC}"
echo "System User ID: $SYSTEM_USER_ID"
echo "Default Box ID: $DEFAULT_BOX_ID"

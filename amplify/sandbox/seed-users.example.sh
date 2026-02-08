#!/bin/bash
# Seed test users into sandbox Cognito User Pool
# Copy this file to seed-users.sh and update with your values

# Auto-extract User Pool ID from amplify_outputs.json
if [ -f amplify_outputs.json ]; then
  USER_POOL_ID=$(cat amplify_outputs.json | grep -o '"user_pool_id": "[^"]*' | cut -d'"' -f4)
  REGION=$(cat amplify_outputs.json | grep -o '"aws_region": "[^"]*' | head -1 | cut -d'"' -f4)
  echo "Using User Pool: $USER_POOL_ID in $REGION"
else
  echo "Error: amplify_outputs.json not found. Start sandbox first."
  exit 1
fi

# Define users: "email|password|group" (group is optional)
USERS=(
  "testuser@example.com|TestPassword123!|"
  "admin@example.com|AdminPassword123!|WebAppAdmin"
)

# Loop through users and create them
for user_data in "${USERS[@]}"; do
  IFS='|' read -r email password group <<< "$user_data"
  
  echo "Creating user: $email"
  
  # Create user
  aws cognito-idp admin-create-user \
    --user-pool-id "$USER_POOL_ID" \
    --username "$email" \
    --user-attributes Name=email,Value="$email" Name=email_verified,Value=true \
    --message-action SUPPRESS \
    --region "$REGION"
  
  # Set permanent password
  aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "$email" \
    --password "$password" \
    --permanent \
    --region "$REGION"
  
  # Add to group if specified
  if [ -n "$group" ]; then
    echo "Adding $email to group: $group"
    
    # Create group if it doesn't exist
    aws cognito-idp create-group \
      --user-pool-id "$USER_POOL_ID" \
      --group-name "$group" \
      --region "$REGION" 2>/dev/null || true
    
    # Add user to group
    aws cognito-idp admin-add-user-to-group \
      --user-pool-id "$USER_POOL_ID" \
      --username "$email" \
      --group-name "$group" \
      --region "$REGION"
  fi
  
  echo "✓ User created: $email"
done

echo ""
echo "✨ All users created successfully!"

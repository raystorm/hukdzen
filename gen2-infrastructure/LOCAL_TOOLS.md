# Local Development Tools for Gen 2 Migration

## Essential Tools

### 1. Amplify Sandbox
**What:** Local cloud sandbox environment
**Why:** Test changes without affecting prod/dev
**Cost:** Free (uses your AWS account, minimal charges)

```bash
# Start sandbox
npx ampx sandbox

# Sandbox with specific profile
npx ampx sandbox --profile dev

# Delete sandbox when done
npx ampx sandbox delete
```

**Use during:** All development phases

---

### 2. Amplify MCP Server
**What:** Model Context Protocol server for AI assistants
**Why:** AI can read/modify your backend during development

```bash
# Install
npm install -g @aws-amplify/mcp-server-amplify

# Configure in IDE settings
{
  "mcpServers": {
    "amplify": {
      "command": "npx",
      "args": ["-y", "@aws-amplify/mcp-server-amplify"]
    }
  }
}
```

**Use during:** Schema development, debugging

---

### 3. AWS SAM CLI (for Lambda testing)
**What:** Test Lambda functions locally
**Why:** Debug Lambda without deploying

```bash
# Install (Ubuntu)
wget https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip
unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
sudo ./sam-installation/install

# Or via pip
pip install aws-sam-cli

# Test Lambda locally
sam local invoke ingestTrigger -e test-event.json

# Start local API
sam local start-api
```

**Use during:** Lambda function development

---

### 4. LocalStack (Optional - Advanced)
**What:** Local AWS cloud emulator
**Why:** Test without AWS charges, faster iteration
**Cost:** Free (Community) or $25/month (Pro)

```bash
# Install
pip install localstack

# Start LocalStack
localstack start

# Configure Amplify to use LocalStack
export AWS_ENDPOINT_URL=http://localhost:4566
```

**Use during:** Heavy development, testing edge cases
**Note:** Not all Amplify Gen 2 features supported yet

---

### 5. OpenSearch Dashboards (Local)
**What:** Local OpenSearch for testing search
**Why:** Test search queries without AWS costs

```bash
# Docker Compose
docker-compose up opensearch

# Access at http://localhost:5601
```

**Use during:** Search query development, testing indexing

---

### 6. DynamoDB Local
**What:** Local DynamoDB for testing
**Why:** Test queries without AWS costs

```bash
# Docker
docker run -p 8000:8000 amazon/dynamodb-local

# Or download JAR
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

# Configure AWS SDK
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

**Use during:** Data model testing, query optimization

---

### 7. AWS CLI with Local Profiles
**What:** Multiple AWS profiles for different environments
**Why:** Switch between dev/prod/sandbox easily

```bash
# Configure profiles
aws configure --profile dev
aws configure --profile prod

# Use specific profile
aws s3 ls --profile dev
export AWS_PROFILE=dev

# In code
AWS_PROFILE=dev npm run deploy
```

**Use during:** All phases

---

### 8. Amplify Studio (Web-based)
**What:** Visual data modeling and content management
**Why:** Non-developers can manage content

```bash
# Open Studio
npx ampx studio

# Or via AWS Console
# Amplify > Your App > Studio
```

**Use during:** Schema design, content management setup

---

### 9. GraphQL Playground / Postman
**What:** Test GraphQL queries interactively
**Why:** Debug API without frontend

```bash
# Built into Amplify Sandbox
# Access at: http://localhost:20002/graphql

# Or use Postman with AppSync endpoint
```

**Use during:** API testing, query optimization

---

### 10. CloudWatch Logs Insights (Local Viewer)
**What:** View Lambda logs locally
**Why:** Faster debugging than AWS Console

```bash
# Install saw (CloudWatch log viewer)
wget https://github.com/TylerBrock/saw/releases/download/v0.2.2/saw_0.2.2_linux_amd64.tar.gz
tar -xzf saw_0.2.2_linux_amd64.tar.gz
sudo mv saw /usr/local/bin/

# Tail logs
saw watch /aws/lambda/ingestTrigger-dev

# Search logs
saw search /aws/lambda/ingestTrigger-dev "ERROR"
```

**Use during:** Lambda debugging

---

## Recommended Setup for Migration

### Phase 1 (Preparation)
```bash
# Essential
npm install -g @aws-amplify/backend-cli
aws configure --profile dev
aws configure --profile prod

# Recommended
npm install -g @aws-amplify/mcp-server-amplify

# Install saw
wget https://github.com/TylerBrock/saw/releases/download/v0.2.2/saw_0.2.2_linux_amd64.tar.gz
tar -xzf saw_0.2.2_linux_amd64.tar.gz
sudo mv saw /usr/local/bin/
```

### Phase 2-3 (Development)
```bash
# Start sandbox for testing
npx ampx sandbox --profile dev

# In another terminal, tail logs
saw watch /aws/lambda/ingestTrigger-dev

# Test Lambda locally
sam local invoke ingestTrigger -e test-event.json
```

### Phase 4 (Testing)
```bash
# Use GraphQL Playground
npx ampx studio

# Monitor costs
aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-01-31
```

---

## Cost Comparison

| Tool | Cost | When to Use |
|------|------|-------------|
| Amplify Sandbox | ~$0.10/hour | Always (minimal cost) |
| MCP Server | Free | Development |
| SAM CLI | Free | Lambda testing |
| LocalStack Community | Free | Heavy dev work |
| LocalStack Pro | $25/month | Team development |
| DynamoDB Local | Free | Data model testing |
| OpenSearch Local | Free | Search testing |

---

## Docker Compose for Local Stack

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  dynamodb:
    image: amazon/dynamodb-local
    ports:
      - "8000:8000"
    command: "-jar DynamoDBLocal.jar -sharedDb"

  opensearch:
    image: opensearchproject/opensearch:2.11.0
    environment:
      - discovery.type=single-node
      - OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m
    ports:
      - "9200:9200"
      - "9600:9600"

  opensearch-dashboards:
    image: opensearchproject/opensearch-dashboards:2.11.0
    ports:
      - "5601:5601"
    environment:
      OPENSEARCH_HOSTS: '["http://opensearch:9200"]'
```

Start all:
```bash
docker-compose up -d
```

---

## IDE Extensions

### VS Code
- **AWS Toolkit** - Manage AWS resources
- **GraphQL** - GraphQL syntax highlighting
- **Amplify UI Builder** - Visual component builder

### IntelliJ IDEA
- **AWS Toolkit** - AWS integration
- **GraphQL** - GraphQL support

---

## Monitoring Tools

### AWS Cost Explorer CLI
```bash
# Install
pip install awscli-plugin-cost-explorer

# Check costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

### CloudWatch Dashboard Local
```bash
# Install cw (CloudWatch CLI)
wget https://github.com/lucagrulla/cw/releases/download/v4.0.0/cw_4.0.0_linux_amd64.tar.gz
tar -xzf cw_4.0.0_linux_amd64.tar.gz
sudo mv cw /usr/local/bin/

# View metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=ingestTrigger-dev \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-31T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

---

## Summary

**Must Have:**
1. Amplify Sandbox
2. AWS CLI with profiles
3. MCP Server (for AI assistance)

**Should Have:**
4. SAM CLI (Lambda testing)
5. saw (log viewer)
6. GraphQL Playground

**Nice to Have:**
7. DynamoDB Local
8. OpenSearch Local
9. LocalStack

**Total Setup Time:** 30-60 minutes
**Total Cost:** $0-25/month (depending on LocalStack)

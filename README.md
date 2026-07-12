# Priority Compass AI

![Priority Compass AI](images/july_weekend_challenge_2026_priority_compass_ai.png)

![AWS](https://img.shields.io/badge/AWS-Serverless-orange)
![Amazon Bedrock](https://img.shields.io/badge/Amazon-Bedrock-blue)
![Python](https://img.shields.io/badge/Python-3.13-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

| Property | Value |
|----------|-------|
| AWS Region | us-east-1 |
| AI Model | Amazon Nova Lite |
| Runtime | Python 3.13 |
| Architecture | arm64 |
| Frontend | HTML / CSS / JavaScript |
| Backend | AWS Lambda |
| API | Amazon API Gateway (HTTP API) |
| Hosting | AWS Amplify Hosting |

AI-powered productivity application built for the **AWS Weekend Productivity Challenge**.

Priority Compass AI analyzes a list of tasks using the Eisenhower Matrix. It assigns urgency and importance scores, classifies each task into one of the four quadrants, explains the reasoning behind each decision, and generates a recommended execution order using Amazon Bedrock.

---

# Live Application

The application was deployed using AWS Amplify Hosting during the challenge.

> **Note**
>
> To keep AWS costs as low as possible, the live application may be unavailable after the challenge has ended. The complete source code remains available in this repository.

---

# Application

## Task input

![Priority Compass AI website](images/05_app-website.png)

Users can enter up to **8 tasks**, optionally define their available time, and specify a primary goal before requesting an AI analysis.

---

## AI-generated priority matrix

![Priority Compass AI matrix](images/06_app-website_matrix.png)

Amazon Bedrock classifies every task into one of the four Eisenhower Matrix quadrants:

- Urgent & Important
- Important, Not Urgent
- Urgent, Less Important
- Neither Urgent nor Important

Each task also receives:

- Importance score
- Urgency score
- AI explanation

---

## Recommended execution order

![Priority Compass AI recommended order](images/07_app-website_recommended_order.png)

After classifying all tasks, the application generates a recommended execution order together with a brief explanation describing why each task should be performed in that sequence.

---

# Architecture

![Priority Compass AI architecture](images/priority-compass-ai_diagram.png)

```text
Browser
    │
    ▼
AWS Amplify Hosting
    │
    ▼
Amazon API Gateway (HTTP API)
    │
    ▼
AWS Lambda
    │
    ▼
Amazon Bedrock (Amazon Nova Lite)
```

Amazon CloudWatch is used for monitoring and troubleshooting, while AWS Identity and Access Management (IAM) controls the permissions required by the Lambda function.

| Layer | AWS Service |
|--------|-------------|
| Frontend | AWS Amplify Hosting |
| API | Amazon API Gateway (HTTP API) |
| Backend | AWS Lambda |
| AI | Amazon Bedrock (Amazon Nova Lite) |
| Monitoring | Amazon CloudWatch |
| Security | AWS IAM |

---

# AWS Services

### AWS Amplify Hosting

Hosts the static frontend application.

### Amazon API Gateway

Provides the public HTTP API endpoint.

Responsible for:

- Routing requests
- Request throttling
- CORS

### AWS Lambda

Implements the backend logic.

Responsibilities:

- Validate requests
- Validate task limits
- Invoke Amazon Bedrock
- Validate the AI response
- Calculate the execution order
- Return the final response

### Amazon Bedrock

Uses **Amazon Nova Lite** to:

- Analyze tasks
- Classify priorities
- Explain decisions

### Amazon CloudWatch

Stores Lambda execution logs for troubleshooting.

### AWS IAM

Provides least-privilege permissions allowing the Lambda function to invoke only the required Amazon Bedrock model.

---

# AWS Configuration

## AWS Amplify deployment

![AWS Amplify deployed](images/01_aws_amplify-deployed.png)

The frontend is automatically deployed whenever changes are pushed to the configured GitHub branch.

---

## Amazon API Gateway

![API Gateway route](images/02_api_gateway-post_analyze.png)

The application exposes a single endpoint:

```text
POST /analyze
```

---

## AWS Lambda environment variables

![Lambda variables](images/03_aws_lambda-variables.png)

Environment variables:

```text
MODEL_ID=amazon.nova-lite-v1:0
ALLOWED_ORIGIN=https://YOUR_AMPLIFY_DOMAIN
```

Replace `https://YOUR_AMPLIFY_DOMAIN` with your exact AWS Amplify URL.

---

## AWS IAM permissions

![IAM policy](images/04_aws_iam-policies.png)

The Lambda execution role contains an inline policy that allows invoking only the Amazon Nova Lite model.

---

# Repository Structure

```text
priority-compass-ai/
├── index.html
├── styles.css
├── app.js
├── robots.txt
├── lambda/
│   ├── lambda_function.py
│   └── requirements.txt
├── images/
├── README.md
├── LICENSE
└── .gitignore
```

The frontend files remain in the repository root because AWS Amplify publishes the root directory.

---

# Prerequisites

Before deploying the project, make sure you have:

- An AWS account
- Amazon Bedrock enabled
- Access to the Amazon Nova Lite model
- Git
- Python 3.13

> **Region**
>
> This project was developed and tested in **US East (N. Virginia)** (`us-east-1`).

---

# Quick Deployment

**Estimated deployment time:** 15–20 minutes.

---

## 1. Create the GitHub repository

Suggested repository name:

```text
priority-compass-ai
```

Push all project files to the repository.

---

## 2. Deploy the frontend with AWS Amplify

Create an AWS Amplify application.

Suggested application name:

```text
priority-compass-ai
```

Connect the application to your GitHub repository.

Select the branch you want to deploy.

Example:

```text
main
```

The frontend files remain in the repository root.

After deployment, copy your Amplify domain.

Example:

```text
https://main.example123.amplifyapp.com
```

---

## 3. Create the Lambda function

Create an AWS Lambda function using the following configuration.

Suggested function name:

```text
priority-compass-ai
```

Configuration:

```text
Runtime:
Python 3.13

Architecture:
arm64

Memory:
128 MB

Timeout:
10 seconds
```

These values are sufficient for this project while keeping Lambda costs as low as possible.

The backend source code is located at:

```text
lambda/lambda_function.py
```

Create a ZIP archive containing only:

```text
lambda_function.py
```

The file must be located at the root of the ZIP archive.

Upload the ZIP file to the Lambda function.

Configure the following environment variables:

```text
MODEL_ID=amazon.nova-lite-v1:0
ALLOWED_ORIGIN=https://YOUR_AMPLIFY_DOMAIN
```

Replace `https://YOUR_AMPLIFY_DOMAIN` with your exact Amplify URL, without a trailing slash.

Example:

```text
ALLOWED_ORIGIN=https://main.example123.amplifyapp.com
```

---

## 4. Configure IAM

Open the Lambda function and navigate to:

```text
Configuration
→ Permissions
→ Execution role
```

The execution role usually has a generated name similar to:

```text
priority-compass-ai-role-abc123
```

or

```text
AWSLambdaBasicExecutionRole-119386cd...
```

Click the execution role name to open it in AWS Identity and Access Management (IAM).

Choose:

```text
Add permissions
→ Create inline policy
```

Suggested policy name:

```text
InvokeAmazonNovaLite
```

Create a policy similar to:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "InvokeAmazonNovaLite",
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": "arn:aws:bedrock:us-east-1::foundation-model/amazon.nova-lite-v1:0"
    }
  ]
}
```

Attach this inline policy to the **Lambda execution role**.

The execution role also requires the default CloudWatch Logs permissions automatically created by AWS Lambda.

---

## 5. Create Amazon API Gateway

Create an **HTTP API**.

Suggested API name:

```text
priority-compass-ai-api
```

Create the route:

```text
POST /analyze
```

Integrate the route with the Lambda function:

```text
priority-compass-ai
```

Use the default stage:

```text
$default
```

Enable automatic deployment for the `$default` stage.

---

## 6. Configure CORS

Configure CORS with the following values:

```text
Access-Control-Allow-Origin:
https://YOUR_AMPLIFY_DOMAIN

Access-Control-Allow-Headers:
content-type

Access-Control-Allow-Methods:
POST

Access-Control-Expose-Headers:
Leave empty

Access-Control-Max-Age:
3600

Access-Control-Allow-Credentials:
No
```

Replace `https://YOUR_AMPLIFY_DOMAIN` with your exact AWS Amplify URL.

Example:

```text
https://main.example123.amplifyapp.com
```

Use the same value in the Lambda environment variable:

```text
ALLOWED_ORIGIN=https://YOUR_AMPLIFY_DOMAIN
```

For HTTP APIs, API Gateway automatically handles CORS preflight requests. No additional `OPTIONS` route is required.

---

## 7. Configure request throttling

Open the `$default` stage.

Configure route throttling for:

```text
POST /analyze
```

Suggested values:

```text
Rate:
1 request per second

Burst:
2 requests
```

These values provide sufficient protection for a public demonstration while keeping the application responsive.

---

## 8. Update the frontend

Open:

```text
app.js
```

Update the API endpoint:

```javascript
const CONFIG = {
    apiUrl: "https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/analyze"
};
```

Commit and push the changes.

AWS Amplify automatically redeploys the application after every push.

---

# Run Locally (Optional)

If you would like to preview the frontend before deploying it to AWS Amplify Hosting, start a simple local web server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

The frontend behaves the same way as it will after deployment to AWS Amplify Hosting.

To perform a complete test, update the API endpoint in `app.js` to point to your deployed Amazon API Gateway.

---

# Lambda Dependencies

The Lambda function does not require any external Python packages.

Create:

```text
lambda/requirements.txt
```

With the following content:

```text
# No external dependencies.
# Boto3 and Botocore are provided by the AWS Lambda Python runtime.
```

The deployment package only needs:

```text
lambda_function.py
```

---

# Cost and Abuse Controls

This project was designed with two primary goals:

- Keep AWS costs as low as possible.
- Reduce abusive usage while the application is publicly available.

The following controls were implemented:

- Amazon API Gateway HTTP API instead of REST API.
- API Gateway request throttling.
- Maximum of **8 tasks** per request.
- Request body validation.
- Task length validation.
- Restricted CORS origin.
- Lambda-side Origin validation.
- Prompt injection resistance.
- Low Amazon Nova Lite temperature.
- Limited Bedrock output tokens.
- AI response validation.
- Deterministic execution ordering inside Lambda.
- No database.
- No persistent storage.
- No provisioned concurrency.
- No sensitive task content written to CloudWatch Logs.

---

# Cost Optimization

To minimize infrastructure costs, the optional **AWS Amplify Firewall** was intentionally disabled.

Although the Amplify Firewall provides additional protection through AWS WAF, it also introduces fixed monthly charges plus request-based costs.

For this demonstration project, the following controls already provide a good level of protection:

- API Gateway request throttling.
- Restricted CORS origin.
- Lambda-side Origin validation.
- Maximum of 8 tasks per request.
- Request validation.
- Payload size validation.
- AI response validation.
- Limited Bedrock output.
- Least-privilege IAM permissions.
- No persistent storage.

These controls significantly reduce abusive usage while keeping operational costs close to zero.

> **Production recommendation**
>
> For production workloads exposed to a large public audience, consider enabling AWS WAF (through AWS Amplify Firewall or directly in front of Amazon API Gateway), implementing authentication, usage plans, monitoring, and additional rate-limiting mechanisms.

---

# Security Notes

The following items are **public** and are **not** AWS credentials:

- AWS Amplify URL
- Amazon API Gateway endpoint

Never commit any of the following to your repository:

- AWS Access Keys
- AWS Secret Access Keys
- AWS Session Tokens
- IAM credentials
- Private certificates
- Billing information
- `.env` files containing secrets
- Private configuration files
- CloudWatch logs containing sensitive information

---

# Resource Names

The following resource names are suggested throughout this project.

| Resource | Suggested Name |
|----------|----------------|
| GitHub repository | `priority-compass-ai` |
| AWS Amplify application | `priority-compass-ai` |
| AWS Lambda function | `priority-compass-ai` |
| IAM inline policy | `InvokeAmazonNovaLite` |
| Amazon API Gateway | `priority-compass-ai-api` |
| API Route | `POST /analyze` |
| API Stage | `$default` |
| Lambda Log Group | `/aws/lambda/priority-compass-ai` |
| Environment Variable | `MODEL_ID` |
| Environment Variable | `ALLOWED_ORIGIN` |
| GitHub Release Tag | `v1.0.0` |
| GitHub Release Title | `Priority Compass AI v1.0` |

The IAM execution role is normally created automatically by AWS and therefore may have a generated name.

---

# Project Highlights

- AI-powered task prioritization using the Eisenhower Matrix.
- Serverless architecture.
- Amazon Bedrock integration using Amazon Nova Lite.
- Cost-aware design.
- Security-first approach with multiple validation layers.
- Fully documented deployment process.
- Public GitHub repository.
- Designed as a reproducible AWS Builder challenge project.

---

# License

This project is licensed under the MIT License.

# Priority Compass AI

![Priority Compass AI](images/july_weekend_challenge_2026_priority_compass_ai.png)

![AWS](https://img.shields.io/badge/AWS-Serverless-orange)
![Amazon Bedrock](https://img.shields.io/badge/Amazon-Bedrock-blue)
![Python](https://img.shields.io/badge/Python-3.13-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

AI-powered productivity application built for the **AWS Weekend Productivity Challenge**.

Priority Compass AI analyzes a list of tasks using the Eisenhower Matrix. It assigns urgency and importance scores, classifies each task into one of the four quadrants, explains the reasoning behind each decision, and generates a recommended execution order using Amazon Bedrock.

---

## Live Application

The application was deployed using AWS Amplify Hosting during the challenge.

> **Note**
>
> To keep AWS costs as low as possible, the live application may be unavailable after the challenge has ended. The complete source code remains available in this repository.

---

## Application

### Task input

![Priority Compass AI website](images/05_app-website.png)

### AI-generated priority matrix

![Priority Compass AI matrix](images/06_app-website_matrix.png)

### Recommended execution order

![Priority Compass AI recommended order](images/07_app-website_recommended_order.png)

---

## Architecture

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

## AWS Services

- **AWS Amplify Hosting** – Hosts the static frontend.
- **Amazon API Gateway** – Exposes the `POST /analyze` endpoint and applies request throttling.
- **AWS Lambda** – Validates requests, invokes Amazon Bedrock, validates the AI response, and generates the execution order.
- **Amazon Bedrock (Amazon Nova Lite)** – Analyzes and prioritizes tasks.
- **Amazon CloudWatch** – Stores Lambda logs.
- **AWS IAM** – Provides least-privilege permissions.

---

## AWS Configuration

### AWS Amplify deployment

![AWS Amplify deployed](images/01_aws_amplify-deployed.png)

### Amazon API Gateway route

![API Gateway route](images/02_api_gateway-post_analyze.png)

### AWS Lambda environment variables

![Lambda variables](images/03_aws_lambda-variables.png)

### AWS IAM permissions

![IAM policy](images/04_aws_iam-policies.png)

---

## Repository Structure

```text
priority-compass-ai/
├── index.html
├── styles.css
├── app.js
├── robots.txt
├── lambda/
│   └── lambda_function.py
├── images/
├── README.md
├── LICENSE
└── .gitignore
```

The frontend remains in the repository root because AWS Amplify publishes the root directory.

---

## Prerequisites

Before deploying the project, make sure you have:

- An AWS account
- Amazon Bedrock enabled
- Access to the Amazon Nova Lite model
- AWS Amplify Hosting
- Python 3.13
- Git

> **Region**
>
> This project was developed and tested in **US East (N. Virginia) (`us-east-1`)**.

---

## Quick Deployment

### 1. Deploy the frontend

Deploy these files with AWS Amplify Hosting:

- `index.html`
- `styles.css`
- `app.js`
- `robots.txt`

After deployment, copy your Amplify domain.

### 2. Deploy the Lambda function

The backend source code is located at:

```text
lambda/lambda_function.py
```

Create a ZIP archive containing only:

```text
lambda_function.py
```

Create a Python 3.13 Lambda function and upload the ZIP archive.

Configure:

```text
MODEL_ID=amazon.nova-lite-v1:0
ALLOWED_ORIGIN=https://YOUR_AMPLIFY_DOMAIN
```

### 3. Configure Amazon API Gateway

Create an **HTTP API**.

Create the route:

```text
POST /analyze
```

Integrate it with the Lambda function.

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

Replace `https://YOUR_AMPLIFY_DOMAIN` with the exact AWS Amplify URL, without a trailing slash.

Example:

```text
https://main.example123.amplifyapp.com
```

Use the same exact value in the Lambda environment variable:

```text
ALLOWED_ORIGIN=https://YOUR_AMPLIFY_DOMAIN
```

For HTTP APIs, API Gateway automatically handles CORS preflight requests, so you do not need to create a separate `OPTIONS` route.

Configure request throttling.

### 4. Configure IAM

Attach a policy similar to:

```json
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Effect":"Allow",
      "Action":"bedrock:InvokeModel",
      "Resource":"arn:aws:bedrock:*::foundation-model/amazon.nova-lite-v1:0"
    }
  ]
}
```

The execution role also requires the default CloudWatch Logs permissions.

### 5. Update the frontend

Edit `app.js`:

```javascript
const CONFIG = {
  apiUrl: "https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/analyze"
};
```

Commit the changes and Amplify will redeploy automatically.

---

## Run Locally

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```

---

## Cost and Abuse Controls

- HTTP API instead of REST API
- API Gateway throttling
- Maximum of 8 tasks per request
- Request payload validation
- Restricted CORS origin
- Low model temperature
- Limited output tokens
- No database
- No persistent storage
- No provisioned concurrency
- Lambda-side AI response validation
- No sensitive task content written to CloudWatch logs

---

## Security Notes

The API Gateway endpoint and Amplify URL are public endpoints and are **not** AWS credentials.

Never commit:

- AWS Access Keys
- AWS Secret Access Keys
- AWS Session Tokens
- Private certificates
- Billing information
- `.env` files containing secrets
- Private configuration files

---

## License

MIT

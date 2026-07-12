# Priority Compass AI

AI-powered productivity application built for the AWS Weekend Productivity Challenge.

Priority Compass AI analyzes a list of tasks using the Eisenhower Matrix. It assigns urgency and importance scores, classifies each task into a quadrant, explains the decision, and creates a recommended execution order.

## Live application

The application is deployed with AWS Amplify Hosting.

## Architecture

```text
Browser
  ↓
AWS Amplify Hosting
  ↓
Amazon API Gateway
  ↓
AWS Lambda
  ↓
Amazon Bedrock
```

Amazon CloudWatch is used for Lambda logs and troubleshooting. AWS Identity and Access Management controls the permissions used by the Lambda function.

## AWS services

- **AWS Amplify Hosting**: hosts the static frontend.
- **Amazon API Gateway**: exposes the `POST /analyze` endpoint and applies request throttling.
- **AWS Lambda**: validates requests, invokes Amazon Bedrock, validates the model response, and calculates the execution order.
- **Amazon Bedrock**: analyzes and classifies the tasks with Amazon Nova Lite.
- **Amazon CloudWatch**: stores execution logs for troubleshooting.
- **AWS IAM**: grants the Lambda function permission to invoke only the selected model.

## Repository structure

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

The frontend files remain in the repository root because AWS Amplify currently publishes the root directory.

## Run the frontend locally

Start a local static server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Backend configuration

The frontend calls the Amazon API Gateway endpoint configured in `app.js`:

```javascript
const CONFIG = {
  apiUrl: "https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/analyze"
};
```

The API URL is a public endpoint, not an AWS credential. Security is enforced through API throttling, request validation, CORS restrictions, strict Lambda validation, limited task counts, and constrained Amazon Bedrock output.

## Lambda deployment

The Lambda source code is stored in:

```text
lambda/lambda_function.py
```

To deploy it manually, create a ZIP file with `lambda_function.py` at the root of the archive and upload it to the existing Lambda function.

The function uses these environment variables:

```text
MODEL_ID=amazon.nova-lite-v1:0
ALLOWED_ORIGIN=https://YOUR_AMPLIFY_DOMAIN
```

Do not commit AWS access keys, secret keys, session tokens, account credentials, or private configuration files.

## Cost and abuse controls

- HTTP API instead of REST API
- API Gateway throttling
- Maximum of 8 tasks per request
- Request body and field size limits
- Restricted CORS origin
- Low model temperature
- Limited output tokens
- No database or user authentication
- No provisioned concurrency
- No sensitive task content written to logs

## Security notes

The API Gateway URL and Amplify URL are public by design and are not credentials.

Never add these items to the repository:

- AWS access keys
- AWS secret access keys
- AWS session tokens
- private certificates
- billing data
- exported CloudWatch logs containing sensitive data
- `.env` files containing secrets

## License

MIT

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

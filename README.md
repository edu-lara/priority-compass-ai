# Priority Compass AI

Frontend for an AI-powered productivity application built for the AWS Weekend Productivity Challenge.

## Files

- `index.html`
- `styles.css`
- `app.js`

## Run locally

Open `index.html` in a browser, or run a local static server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Backend connection

After creating the Lambda Function URL, edit `app.js`:

```javascript
const CONFIG = {
  apiUrl: "https://YOUR-ID.lambda-url.us-east-1.on.aws/"
};
```

Until a URL is configured, the interface runs in demo mode with local sample classifications.

## Repository

Planned repository:

```text
https://github.com/edu-lara/priority-compass-ai
```

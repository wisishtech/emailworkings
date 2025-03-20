# Email Template Sender with Zoho Integration

This project provides a form interface to select and send email templates using the Zoho Mail API through a Netlify serverless function.

## Implementation Guide

### 1. Project Structure

```
your-project/
├── public/
│   └── index.html  (your existing HTML file)
├── functions/
│   └── send-email.js  (new file for the Netlify Function)
├── package.json
└── netlify.toml
```

### 2. Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

This will start Netlify Dev, which will serve your frontend and functions locally.

### 3. Environment Variables

In production, you should set the following environment variables in the Netlify dashboard:

- `ZOHO_ACCESS_TOKEN`: Your Zoho Mail API access token
- `ZOHO_ACCOUNT_ID`: Your Zoho account ID
- `ZOHO_SENDER_EMAIL`: Your verified sender email in Zoho

For local development, you can set these in the `.env` file:

```
ZOHO_ACCESS_TOKEN=your-token-here
ZOHO_ACCOUNT_ID=your-account-id
ZOHO_SENDER_EMAIL=your-sender-email
```

### 4. Deploy to Netlify

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Netlify
3. Configure the build settings in Netlify:
   - Build command: Leave empty if no build step is needed
   - Publish directory: `.` (or your build output directory)
4. Add the environment variables in the Netlify dashboard under Site settings > Environment variables
5. Deploy your site

### 5. About CORS

By using a Netlify Function, we avoid CORS issues because:

1. The browser only makes requests to your own domain (same-origin)
2. The serverless function makes the cross-origin request to Zoho's API server-side
3. The function adds CORS headers to its responses to allow your frontend to communicate with it

### 6. Zoho API Token Management

Note that Zoho access tokens expire. In a production environment, you should implement:

1. Token refresh mechanism 
2. Secure storage of refresh tokens
3. Error handling for expired tokens

For a complete implementation, consider using Zoho's OAuth flow for more reliable token management.

### 7. Troubleshooting

- If you encounter 401 errors, your Zoho token may have expired
- If you see 404 errors, check your account ID and API endpoints
- For CORS errors in development, ensure you're using Netlify Dev which properly routes function requests
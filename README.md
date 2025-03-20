# Email Template Sender

A simple web application to send templated emails using Nodemailer with Gmail SMTP.

## Features
- Predefined email templates (Welcome, Newsletter, Promotion, Custom)
- Real-time email preview
- Form validation
- Loading states and success messages
- Gmail SMTP integration via Nodemailer

## Prerequisites
- Node.js (v14 or higher)
- Gmail account with 2-Factor Authentication enabled
- Gmail App Password (generated from Google Account settings)

## Project Structure

email-sender/
├── public/
│   └── index.html    # Client-side HTML form
├── .env              # Environment variables
├── server.js         # Server-side logic with Nodemailer
├── package.json      # Dependencies and scripts
└── README.md         # This file


## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd email-sender
    ```

2. **Install Dependencies**
    ```bash
    npm install

    ```

3. **Generate Gmail App Password**
Go to [Google Account](https://myaccount.google.com/)

- Enable 2-Factor Authentication
- Navigate to Security > App passwords
- Generate a new App Password for this app
- Copy the 16-character password

4. **Configure Environment Variables**
Create a .env file in the root directory:
    ```
    GMAIL_USER=your-email@gmail.com
    GMAIL_PASS=your-16-character-app-password
    PORT=3000  # Optional: defaults to 3000
    ```

5. **Run the application**  
   ```bash
    node server.js
    ```
    Open your browser to http://localhost:3200

##  Usage

- Fill out the form with recipient details
- Choose a template or create a custom one
- Preview updates in real-time
- Click "Send Email" to send via Gmail SMTP

## Security Notes

- Keep `.env` in `.gitignore` to avoid exposing credentials
- Use an App password instead of your regular Gmail password
- Deploy to Heroky, Render or Vercel for Production use.

## License

`Wisish Tech`
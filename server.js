const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Verify SMTP configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP configuration error:', error.message);
    } else {
        console.log('SMTP server is ready to send emails');
    }
});

// Email sending function
async function sendMail(to, subject, html) {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: to,
        subject: subject,
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        throw new Error(`Failed to send email: ${error.message}`);
    }
}

app.post('/send-email', async (req, res) => {
    const { to, subject, html } = req.body;

    // Validate request body
    if (!to || !subject || !html) {
        return res.status(400).json({
            error: 'Bad Request',
            details: 'Missing required fields: "to", "subject", and "html" are required'
        });
    }

    try {
        const result = await sendMail(to, subject, html);
        console.log('Email sent successfully:', result.messageId);
        res.status(200).json({
            message: 'Email sent successfully',
            messageId: result.messageId
        });
    } catch (error) {
        console.error('Error in send-email endpoint:', {
            message: error.message,
            stack: error.stack,
            smtpResponse: error.response || 'No SMTP response available',
            smtpCode: error.code || 'No SMTP code available'
        });
        res.status(500).json({
            error: 'Failed to send email',
            details: {
                message: error.message,
                smtpResponse: error.response || 'N/A',
                smtpCode: error.code || 'N/A'
            }
        });
    }
});

// Basic error handling for unhandled routes
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', details: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unexpected server error:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        details: 'An unexpected error occurred on the server'
    });
});

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
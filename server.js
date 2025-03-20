// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration
const ZOHO_ACCESS_TOKEN = '1000.FT9PKUR8G68TM41FLAFSJTF681K3WG';
const ZOHO_ACCOUNT_ID = '824284292';
const ZOHO_SENDER_EMAIL = 'wizzyalex132@gmail.com';

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        const { recipient, subject, content } = req.body;

        // Input validation
        if (!recipient || !subject || !content) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields',
                details: {
                    missingFields: {
                        recipient: !recipient,
                        subject: !subject,
                        content: !content
                    }
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipient)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
                details: { recipient }
            });
        }

        const fetch = (await import('node-fetch')).default;

        const response = await fetch(
            `https://mail.zoho.com/api/accounts/${ZOHO_ACCOUNT_ID}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${ZOHO_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fromAddress: ZOHO_SENDER_EMAIL,
                    toAddress: recipient,
                    subject: subject,
                    content: content,
                    mailFormat: 'html'
                })
            }
        );

        const responseBody = await response.text();

        if (!response.ok) {
            let errorDetails;
            try {
                errorDetails = JSON.parse(responseBody);
            } catch {
                errorDetails = responseBody;
            }

            throw new Error(`Failed to send email: ${response.statusText}`, {
                cause: {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorDetails
                }
            });
        }

        const result = JSON.parse(responseBody);
        res.status(200).json({ 
            success: true, 
            message: 'Email sent successfully',
            data: result,
            requestDetails: {
                recipient,
                subject,
                contentLength: content.length
            }
        });
    } catch (error) {
        console.error('Detailed error sending email:', {
            message: error.message,
            cause: error.cause,
            stack: error.stack
        });
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to send email',
            details: {
                error: error.message,
                cause: error.cause,
                timestamp: new Date().toISOString(),
                endpoint: '/api/send-email'
            }
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Unexpected server error',
        details: {
            error: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        }
    });
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
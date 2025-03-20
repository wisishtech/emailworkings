const express = require('express');
const cors = require('cors');
const path = require('path'); // Add this for static file serving
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

// Configuration
const ZOHO_ACCESS_TOKEN = '1000.FT9PKUR8G68TM41FLAFSJTF681K3WG';
const ZOHO_ACCOUNT_ID = '824284292';
const ZOHO_SENDER_EMAIL = 'wizzyalex132@gmail.com';

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        const { recipient, subject, content } = req.body;
        
        // Dynamically import node-fetch
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

        if (!response.ok) {
            throw new Error(`Failed to send email: ${response.statusText}`);
        }

        const result = await response.json();
        res.status(200).json({ 
            success: true, 
            message: 'Email sent successfully',
            data: result 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email',
            error: error.message 
        });
    }
});

// Start server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
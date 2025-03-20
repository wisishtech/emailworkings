const fetch = require('node-fetch');

const ZOHO_ACCESS_TOKEN = '1000.FT9PKUR8G68TM41FLAFSJTF681K3WG';
const ZOHO_ACCOUNT_ID = '824284292';
const ZOHO_SENDER_EMAIL = 'wizzyalex132@gmail.com';

exports.handler = async (event, context) => {
  try {
    const { recipient, subject, content } = JSON.parse(event.body);

    // Input validation
    if (!recipient || !subject || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields',
          details: {
            missingFields: {
              recipient: !recipient,
              subject: !subject,
              content: !content,
            },
          },
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Invalid email format',
          details: { recipient },
        }),
      };
    }

    const response = await fetch(
      `https://mail.zoho.com/api/accounts/${ZOHO_ACCOUNT_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-oauthtoken ${ZOHO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress: ZOHO_SENDER_EMAIL,
          toAddress: recipient,
          subject: subject,
          content: content,
          mailFormat: 'html',
        }),
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
          body: errorDetails,
        },
      });
    }

    const result = JSON.parse(responseBody);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        data: result,
        requestDetails: {
          recipient,
          subject,
          contentLength: content.length,
        },
      }),
    };
  } catch (error) {
    console.error('Detailed error sending email:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message || 'Failed to send email',
        details: {
          error: error.message,
          cause: error.cause,
          timestamp: new Date().toISOString(),
          endpoint: '/api/send-email',
        },
      }),
    };
  }
};
/**
 * Serverless Email Function for Vercel / Node runtime
 * Dispatches transactional survey emails via Brevo (Sendinblue) API v3
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Brevo API key is not configured on the server (BREVO_API_KEY missing).',
    });
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'playgummygum@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'Pulse Surveys · GummyGum';

  try {
    const { to, subject, htmlContent, textContent, pulseName, surveyUrl } = req.body;

    if (!to || !Array.isArray(to) || to.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid "to" recipients array.' });
    }

    if (!subject || !htmlContent) {
      return res.status(400).json({ error: 'Missing "subject" or "htmlContent".' });
    }

    // Brevo API accepts recipients array formatted as: [{ email, name }]
    const formattedRecipients = to.map((r) => {
      if (typeof r === 'string') {
        return { email: r.trim() };
      }
      return { email: r.email?.trim(), name: r.name?.trim() };
    });

    const payload = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: formattedRecipients,
      subject,
      htmlContent,
      textContent: textContent || `You are invited to take the pulse survey "${pulseName || 'Pulse'}". Open: ${surveyUrl || ''}`,
      tags: ['pulse-survey', 'invitation'],
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API Error:', data);
      return res.status(response.status).json({
        error: data.message || 'Failed to dispatch email via Brevo.',
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      messageId: data.messageId,
      recipientCount: formattedRecipients.length,
    });
  } catch (error) {
    console.error('Serverless send-email handler failed:', error);
    return res.status(500).json({
      error: 'Internal server error while sending email.',
      message: error.message,
    });
  }
}

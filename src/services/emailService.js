/**
 * Brevo Transactional Email Service for Pulse Surveys
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Build responsive, polished HTML email template
 */
export function buildSurveyInviteEmailHtml({
  pulseName,
  description,
  questionCount,
  surveyUrl,
  accessCode,
  privacy,
  delivery,
  recipientName,
}) {
  const isAnonymous = privacy === 'anonymous';
  const isLive = delivery === 'live';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're invited to share feedback</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center; border-bottom: 1px solid #f1f5f9;">
              <div style="display: inline-block; padding: 6px 14px; background-color: #ede9fe; border-radius: 9999px; border: 1px solid #ddd6fe; color: #6d28d9; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
                ${isLive ? '🔴 Live Session Invitation' : '📋 Team Pulse Survey'}
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                ${pulseName}
              </h1>
              ${
                description
                  ? `<p style="margin: 10px 0 0 0; font-size: 14px; color: #64748b; line-height: 1.5;">${description}</p>`
                  : ''
              }
            </td>
          </tr>

          <!-- Core Message & Badges -->
          <tr>
            <td style="padding: 28px 32px;">
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155; line-height: 1.6;">
                Hello${recipientName ? ` <strong>${recipientName}</strong>` : ''},
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #334155; line-height: 1.6;">
                Your team lead invited you to share your candid perspective. Your feedback helps shape team priorities, workload balance, and workplace culture.
              </p>

              <!-- Highlights Box -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 13px; color: #64748b; padding-bottom: 8px;">Questions:</td>
                        <td align="right" style="font-size: 13px; font-weight: 700; color: #0f172a; padding-bottom: 8px;">
                          ${questionCount} questions (~2 mins)
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #64748b; padding-bottom: 8px;">Privacy Guarantee:</td>
                        <td align="right" style="font-size: 13px; font-weight: 700; color: #7c3aed; padding-bottom: 8px;">
                          ${isAnonymous ? '🔒 100% Anonymous' : 'Identified'}
                        </td>
                      </tr>
                      ${
                        accessCode
                          ? `<tr>
                        <td style="font-size: 13px; color: #64748b;">Session PIN Code:</td>
                        <td align="right" style="font-size: 14px; font-weight: 800; color: #4338ca; font-family: monospace; letter-spacing: 0.1em;">
                          ${accessCode}
                        </td>
                      </tr>`
                          : ''
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${surveyUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 36px; border-radius: 10px; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);">
                  Open Pulse Survey →
                </a>
              </div>

              <!-- Direct Link text fallback -->
              <p style="margin: 24px 0 0 0; font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center;">
                Or copy and paste this link into your browser:<br>
                <a href="${surveyUrl}" style="color: #6366f1; word-break: break-all;">${surveyUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Powered by <strong>Pulse</strong> · Designed for transparent, thriving teams.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Dispatch survey invites to an array of recipients
 */
export async function sendPulseInvitations({
  pulse,
  recipients,
  baseUrl = window.location.origin,
}) {
  if (!pulse || !recipients || recipients.length === 0) {
    return { success: false, reason: 'No recipients provided' };
  }

  // Base survey URL pointing to the hash route
  const pulseUrl = `${baseUrl}/#/survey/${pulse.id}`;

  const formattedRecipients = recipients.map((r) => {
    if (typeof r === 'string') {
      return { email: r.trim(), name: r.split('@')[0] };
    }
    return {
      email: r.email?.trim(),
      name: r.name?.trim() || r.email?.split('@')[0],
    };
  });

  const subject = `You're invited: ${pulse.name} [Pulse Survey]`;

  const htmlContent = buildSurveyInviteEmailHtml({
    pulseName: pulse.name,
    description: pulse.description,
    questionCount: pulse.questions?.length || 0,
    surveyUrl: pulseUrl,
    accessCode: pulse.accessCode,
    privacy: pulse.privacy,
    delivery: pulse.delivery,
  });

  // 1. Try serverless backend endpoint (/api/send-email)
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: formattedRecipients,
        subject,
        htmlContent,
        pulseName: pulse.name,
        surveyUrl: pulseUrl,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        mode: 'brevo_serverless',
        messageId: data.messageId,
        count: formattedRecipients.length,
        surveyUrl: pulseUrl,
      };
    }
  } catch {
    // Serverless endpoint not present (e.g., pure client Vite dev server)
  }

  // 2. Try direct Brevo API v3 if VITE_BREVO_API_KEY is defined in client env
  const clientBrevoKey = import.meta.env.VITE_BREVO_API_KEY;
  if (clientBrevoKey) {
    try {
      const senderEmail =
        import.meta.env.VITE_BREVO_SENDER_EMAIL || 'playgummygum@gmail.com';
      const senderName =
        import.meta.env.VITE_BREVO_SENDER_NAME || 'Pulse Surveys · GummyGum';

      const directRes = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': clientBrevoKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: formattedRecipients,
          subject,
          htmlContent,
          tags: ['pulse-invitation'],
        }),
      });

      if (directRes.ok) {
        const data = await directRes.json();
        return {
          success: true,
          mode: 'brevo_client_direct',
          messageId: data.messageId,
          count: formattedRecipients.length,
          surveyUrl: pulseUrl,
        };
      }
    } catch (directErr) {
      console.warn('Direct Brevo API attempt failed:', directErr);
    }
  }

  // 3. Dev / Testing Simulation Fallback
  console.group(`[Pulse Email Dispatch] Brevo Dev Simulation`);
  console.log(`Recipients (${formattedRecipients.length}):`, formattedRecipients);
  console.log(`Direct Survey Link:`, pulseUrl);
  console.log(`Session Code:`, pulse.accessCode);
  console.groupEnd();

  return {
    success: true,
    mode: 'dev_simulation',
    count: formattedRecipients.length,
    surveyUrl: pulseUrl,
    accessCode: pulse.accessCode,
    recipients: formattedRecipients,
  };
}

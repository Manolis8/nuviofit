// pages/api/brevo.ts
import type { NextApiRequest, NextApiResponse } from 'next';

async function sendEmail(
  apiKey: string,
  to: string,
  name: string,
  subject: string,
  htmlContent: string
) {
  const response = await fetch('https://api.sendEmails.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'NuvioFit Team',
        email: 'nuviofit@gmail.com', // << Replace with your Brevo-verified email
      },
      to: [{ email: to, name }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Email failed: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ error: 'Missing email or username' });
  }

  try {
    const subject = 'Welcome to NuvioFit! 💪';
    const htmlContent = `
      <h1>Welcome to NuvioFit, ${username}!</h1>
      <p>We're excited to have you on board. Start strong, stay consistent, and enjoy the journey.</p>
      <p>Stay hungry,</p>
      <p>The NuvioFit Team</p>
    `;

    const data = await sendEmail(
      process.env.BREVO_API_KEY!,
      email,
      username,
      subject,
      htmlContent
    );

    return res.status(200).json({ message: 'Email sent', data });
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({ error: error.message });
  }
}

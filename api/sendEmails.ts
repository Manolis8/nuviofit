import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
process.env.SUPABASE_SERVICE_ROLE_KEY!,
process.env.VITE_SUPABASE_URL!
);

export default async function sendEmails(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Missing email' });
  }

  // Fetch the username from Supabase using the email
  const { data, error } = await supabase
    .from('onboarding_responses')
    .select('username')
    .eq('email', email)
    .single();

  if (error || !data?.username) {
    console.error("Failed to fetch username:", error);
    return res.status(404).json({ message: 'Username not found for this email' });
  }

  const username = data.username;

  const brevoKey = process.env.BREVO_API_KEY!;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <body>
      <h1 style="color:#63B3ED;">Welcome to the Club, ${username}!</h1>
      <p>We’re thrilled to have you join the NuvioFit movement.</p>
      <p>Start your personalized journey now by visiting your dashboard:</p>
      <a href="https://www.nuviofit.com/dashboard"
         style="display:inline-block;background:#63B3ED;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
        Go to Your Dashboard
      </a>
      <p style="margin-top: 30px; color: #777;">— The NuvioFit Team</p>
    </body>
  </html>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'NuvioFit', email: 'movement@nuviofit.com' },
        to: [{ email, name: username }],
        subject: 'Welcome to the Club!',
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo response error:", errorText);
      return res.status(500).json({ message: 'Brevo API failed' });
    }

    return res.status(200).json({ message: 'Welcome email sent successfully' });
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

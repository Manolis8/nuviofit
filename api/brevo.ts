import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  // Load keys & URL
  const brevoKey = process.env.BREVO_API_KEY!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseUrl = process.env.VITE_SUPABASE_URL!;

  // Get today's date and 7 days ago
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  try {

// 2) Send Feedback emails to users who signed up 7 days ago and feedback_sent = false
const feedbackUsersRes = await fetch(
  `${supabaseUrl}/rest/v1/onboarding_responses?created_at=eq.${sevenDaysAgo}&feedback_sent=eq.false&select=email,username`,
  {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
  }
);
const feedbackUsers = await feedbackUsersRes.json();

for (const user of feedbackUsers) {
  await sendEmail(
    brevoKey,
    user.email,
    user.username || 'Friend',
    "🔥 You In? Help Us Build the Future of Fitness",
    `
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 30px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05); text-align: center;">
          <h2 style="color: #0f766e; font-size: 28px; margin-bottom: 16px;">Yo ${user.username || 'Friend'}, it’s been 7 days!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Your journey has just begun, and we’re pumped to have you on board. 💥</p>
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">At NuvioFit, we’re building more than just a fitness app — we’re building a movement. And you’re part of it.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Now that you've had a week to explore, we’d love to know: What’s working? What’s missing? What could be better?</p>
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">We read every response. Seriously. Your input helps us evolve, improve, and create something truly impactful — not just for you, but for every future warrior who joins.</p>
          <a href="https://nuviofit.com/feedback" style="display: inline-block; margin-top: 30px; padding: 14px 28px; font-size: 16px; font-weight: bold; color: white; background: linear-gradient(to right, #14b8a6, #3b82f6); text-decoration: none; border-radius: 8px;">Share Your Thoughts</a>
          <p style="margin-top: 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">It only takes a minute — and your voice could be the spark that drives the next big upgrade.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Let’s build this together. Stay real. Stay driven.</p>
          <div style="margin-top: 40px; font-size: 13px; color: #9ca3af;">NuvioFit — Stay Hungry. 🚀</div>
        </div>
      </body>
    </html>
    `
  );

  // Mark feedback_sent true
  await fetch(`${supabaseUrl}/rest/v1/onboarding_responses?email=eq.${user.email}`, {
    method: 'PATCH',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ feedback_sent: true }),
  });
}


    return res.status(200).json({
      message: `Feedback emails sent: ${feedbackUsers.length}`,
    });
  } catch (err: any) {
    return res.status(500).json({ message: 'Error in email sending process', error: err.message });
  }
}

// Helper to send email via Brevo API
async function sendEmail(
  apiKey: string,
  to: string,
  username: string,
  subject: string,
  htmlContent: string
) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'NuvioFit', email: 'movement@nuviofit.com' },
      to: [{ email: to, name: username }],
      subject,
      htmlContent,
      textContent: 'This is a fallback text version of the email',
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to send email (status ${res.status}): ${JSON.stringify(err)}`);
  }

  return await res.json(); // Optional: return messageId, etc.
}

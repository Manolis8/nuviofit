import type { VercelRequest, VercelResponse } from '@vercel/node';
import { APP_URL, EMAIL_FROM, EMAIL_FROM_NAME, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, missingEnv } from './_lib/config.js';

// Runs from the Vercel cron in vercel.json (Vercel cron jobs send GET requests).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Only GET or POST allowed' });
  }

  // Vercel sends "Authorization: Bearer $CRON_SECRET" when CRON_SECRET is set; reject everyone else.
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const brevoKey = process.env.BREVO_API_KEY!;
  const supabaseKey = SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = SUPABASE_URL;

  const missing = missingEnv({ BREVO_API_KEY: brevoKey, EMAIL_FROM, SUPABASE_URL: supabaseUrl, SUPABASE_SERVICE_ROLE_KEY: supabaseKey });
  if (missing.length) {
    return res.status(500).json({ message: `Missing env: ${missing.join(', ')}` });
  }

  // Users who signed up 7 to 38 days ago and haven't had the feedback email yet.
  // The cron runs monthly, so this window catches everyone once without emailing very old signups.
  // (created_at is a timestamp, so use a range instead of matching one exact date.)
  const day = 24 * 60 * 60 * 1000;
  const sevenDaysAgo = new Date(Date.now() - 7 * day).toISOString();
  const windowStart = new Date(Date.now() - 38 * day).toISOString();

  try {

// 2) Send Feedback emails to users who signed up 7 days ago and feedback_sent = false
const feedbackUsersRes = await fetch(
  `${supabaseUrl}/rest/v1/onboarding_responses?created_at=lt.${encodeURIComponent(sevenDaysAgo)}&created_at=gte.${encodeURIComponent(windowStart)}&feedback_sent=eq.false&unsubscribed=not.is.true&email=not.is.null&select=email,username`,
  {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
  }
);
if (!feedbackUsersRes.ok) {
  throw new Error(`Supabase query failed: ${await feedbackUsersRes.text()}`);
}
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
          <a href="${APP_URL}/feedback" style="display: inline-block; margin-top: 30px; padding: 14px 28px; font-size: 16px; font-weight: bold; color: white; background: linear-gradient(to right, #14b8a6, #3b82f6); text-decoration: none; border-radius: 8px;">Share Your Thoughts</a>
          <p style="margin-top: 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">It only takes a minute — and your voice could be the spark that drives the next big upgrade.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Let’s build this together. Stay real. Stay driven.</p>
          <div style="margin-top: 40px; font-size: 13px; color: #9ca3af;">NuvioFit — Stay Hungry. 🚀</div>
        </div>
      </body>
    </html>
    `
  );

  // Mark feedback_sent true
  await fetch(`${supabaseUrl}/rest/v1/onboarding_responses?email=eq.${encodeURIComponent(user.email)}`, {
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
      sender: { name: EMAIL_FROM_NAME, email: EMAIL_FROM },
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

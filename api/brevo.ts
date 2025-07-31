import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET allowed' });
  }

  // Load keys & URL
  const brevoKey = process.env.BREVO_API_KEY!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseUrl = process.env.VITE_SUPABASE_URL!;

  // Get today's date and 7 days ago
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  try {
    // 1) Send Welcome emails to users with welcome_sent = false
    const welcomeUsersRes = await fetch(
      `${supabaseUrl}/rest/v1/onboarding_responses?welcome_sent=eq.false&select=email,username`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const welcomeUsers = await welcomeUsersRes.json();

    for (const user of welcomeUsers) {
      const username = user.username || 'Friend';

      await sendEmail(brevoKey, user.email, username, 'Welcome to the Club!', `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Welcome to NuvioFit</title>
      </head>
      <body style="background:#f0f0f0; padding: 30px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 20px; color: #222;">
          <h1 style="color: #63B3ED;">Welcome to the Club, ${username}! 👋</h1>
          <p style="font-size: 18px; margin-top: 10px;">
            We're thrilled to have you join the NuvioFit movement.
          </p>

          <h2 style="color: #38B2AC; margin-top: 30px;">Why We Exist & Our Mission</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            To empower people to master their body and mind through AI-driven, personalized health coaching that adapts to their real life — not just their routine.<br><br>
            We help people build consistent habits in fitness, nutrition, mindfulness, and recovery through one unified, intelligent platform.
          </p>

          <h2 style="color: #38B2AC; margin-top: 30px;">🔮 Our Vision for the Future</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            At NuvioFit, our vision reaches beyond fitness. We aim to reshape the future of health and wellness by creating technologies that help people master both body and mind, through systems that adapt, understand, and empower.<br><br>

            We are not building “just another app.” We are laying the foundation for a revolutionary ecosystem that will redefine how people achieve health, resilience, and balance — mentally and physically.<br><br>

            We envision a world where health technology isn’t just reactive, but predictive. Not generic, but deeply personal. Not focused on trends, but on transforming lives.<br><br>

            We will thrive to lead a movement — a future where people don’t rely on guesswork or motivation alone. Instead, they are equipped with intelligent tools that evolve with them, understand their unique challenges, and guide them to lasting results.<br><br>

            Our long-term mission is clear:<br>
            To build revolutionary products that transform not just individuals, but society’s relationship with health. We want our technology to inspire a generation to live with purpose, strength, and mental clarity — to reshape health culture for decades to come.<br><br>

            This is bigger than fitness. This is about changing how people think, live, and succeed. This is how we will write our name in history.
          </p>

          <div style="margin-top: 50px; text-align: center;">
            <p style="font-size: 18px; font-weight: 600; color: #38B2AC;">
              You’re officially part of this movement — and we can’t wait to see what you achieve!
            </p>
            <p style="font-size: 16px; margin-bottom: 30px;">
              Start your personalized journey now by visiting your dashboard.
            </p>
            <a href="https://www.nuviofit.com/dashboard" target="_blank" rel="noopener noreferrer"
               style="
                 display: inline-block; 
                 background: linear-gradient(90deg, #63B3ED 0%, #38B2AC 100%);
                 color: white; 
                 padding: 14px 30px; 
                 border-radius: 8px; 
                 text-decoration: none; 
                 font-weight: 700; 
                 font-size: 18px;
                 box-shadow: 0 4px 15px rgba(56, 178, 172, 0.5);
                 transition: background 0.3s ease;
               ">
              Go to Your Dashboard
            </a>
          </div>

          <p style="margin-top: 40px; text-align: center; font-style: italic; color: #777;">
            — The NuvioFit Team
          </p>
        </div>
      </body>
      </html>
      `);

      // Mark welcome_sent true
      await fetch(`${supabaseUrl}/rest/v1/onboarding_responses?email=eq.${user.email}`, {
        method: 'PATCH',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ welcome_sent: true }),
      });
    }

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
      message: `Welcome emails sent: ${welcomeUsers.length}, Feedback emails sent: ${feedbackUsers.length}`,
    });
  } catch (err: any) {
    return res.status(500).json({ message: 'Error in email sending process', error: err.message });
  }
}

// Helper to send email via Brevo API
async function sendEmail(apiKey: string, to: string, username: string, subject: string, htmlContent: string) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'NuvioFit', email: 'your_sender_email@nuviofit.com' },
      to: [{ email: to, name }],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to send email: ${JSON.stringify(err)}`);
  }
}


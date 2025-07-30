import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET allowed' });
  }

  const brevoKey = process.env.BREVO_API_KEY!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseUrl = process.env.VITE_SUPABASE_URL!;

  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  try {
    // 1) Fetch welcome users who haven't received welcome email yet
    const welcomeUsersRes = await fetch(
      `${supabaseUrl}/rest/v1/onboarding_responses?welcome_sent=eq.false&select=email,name`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!welcomeUsersRes.ok) {
      const errorText = await welcomeUsersRes.text();
      console.error('Supabase welcomeUsers fetch error:', errorText);
      return res.status(500).json({ message: 'Error fetching welcome users', error: errorText });
    }

    const welcomeUsers = await welcomeUsersRes.json();

    console.log('welcomeUsers response:', welcomeUsers);

    if (!Array.isArray(welcomeUsers)) {
      return res.status(500).json({ message: 'welcomeUsers response is not an array', data: welcomeUsers });
    }

    for (const user of welcomeUsers) {
      await sendEmail(
        brevoKey,
        user.email,
        user.name || 'Friend',
        'Welcome to the Movement!',
        `
        <h1>Hey ${user.name || 'there'} 👋</h1>
        <p>Welcome to the movement for health! We’re pumped to have you.</p>
      `
      );

      // Mark welcome_sent true for this user
      await fetch(`${supabaseUrl}/rest/v1/onboarding_responses?email=eq.${encodeURIComponent(user.email)}`, {
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

    // 2) Fetch feedback users who signed up 7 days ago & haven't got feedback email yet
    const feedbackUsersRes = await fetch(
      `${supabaseUrl}/rest/v1/onboarding_responses?created_at=eq.${sevenDaysAgo}&feedback_sent=eq.false&select=email,name`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!feedbackUsersRes.ok) {
      const errorText = await feedbackUsersRes.text();
      console.error('Supabase feedbackUsers fetch error:', errorText);
      return res.status(500).json({ message: 'Error fetching feedback users', error: errorText });
    }

    const feedbackUsers = await feedbackUsersRes.json();

    console.log('feedbackUsers response:', feedbackUsers);

    if (!Array.isArray(feedbackUsers)) {
      return res.status(500).json({ message: 'feedbackUsers response is not an array', data: feedbackUsers });
    }

    for (const user of feedbackUsers) {
      await sendEmail(
        brevoKey,
        user.email,
        user.name || 'Friend',
        "How's your first week going?",
        `
        <h2>Yo, it's been 7 days!</h2>
        <p>We’d love to hear how your journey is going so far.</p>
        <p><a href="https://nuviofit.com/feedback">Give Feedback</a></p>
      `
      );

      // Mark feedback_sent true for this user
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
      message: `Welcome emails sent: ${welcomeUsers.length}, Feedback emails sent: ${feedbackUsers.length}`,
    });
  } catch (err: any) {
    return res.status(500).json({ message: 'Error in email sending process', error: err.message });
  }
}

// Helper function to send email through Brevo
async function sendEmail(apiKey: string, email: string, name: string, subject: string, htmlContent: string) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Nuviofit', email: 'nuviofit@gmail.com' },
      to: [{ email, name }],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Brevo API error: ${JSON.stringify(errorData)}`);
  }
}

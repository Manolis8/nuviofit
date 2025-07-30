// pages/api/brevo/feedbackEmails.js

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET allowed' });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const SEVEN_DAYS_AGO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // get date like "2025-07-23"

  try {
    const query = `${supabaseUrl}/rest/v1/onboarding_responses?created_at=eq.${SEVEN_DAYS_AGO}&select=email`;

    const usersRes = await fetch(query, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      }
    });

    const users = await usersRes.json();

    if (!users.length) {
      return res.status(200).json({ message: 'No users to email today.' });
    }

    for (const user of users) {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: "Nuviofit",
            email: "nuviofit@gmail.com"
          },
          to: [{ email: user.email }],
          subject: "How’s your first week going?",
          htmlContent: `
            <h2>Yo, it's been 7 days!</h2>
            <p>We'd love to hear how your journey is going so far.</p>
            <p><a href="https://yourwebsite.com/feedback">Give Feedback</a></p>
          `
        })
      });
    }

    return res.status(200).json({ message: `Sent ${users.length} feedback emails.` });
  } catch (err) {
    return res.status(500).json({ message: 'Error sending feedback emails', error: err.message });
  }
}

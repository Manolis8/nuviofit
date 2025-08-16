// /api/unsubscribe.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_API_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.query.token as string;

  if (!token) {
    return res.status(400).send('Missing token.');
  }

  try {
    // Verify JWT token and extract email
    const decoded = jwt.verify(token, UNSUBSCRIBE_SECRET) as { email: string };
    const email = decoded.email;

    // Update Supabase via REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/onboarding_responses?email=eq.${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_API_KEY,
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation', // optional, returns updated row
      },
      body: JSON.stringify({ unsubscribed: true }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).send(`Failed to update unsubscribe: ${errorText}`);
    }

    res.send('You have successfully unsubscribed from our emails.');
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid or expired token.');
  }
}

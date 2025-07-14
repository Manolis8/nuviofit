// api/submitFeedback.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, message, email } = req.body;

  if (!message || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Example: just log it for now (in production, you'd save it or send it)
  console.log('📩 New feedback received:', { name, email, message });

  // Optional: send to email, Supabase, Google Sheets, etc.

  return res.status(200).json({ success: true, message: 'Feedback submitted successfully!' });
}

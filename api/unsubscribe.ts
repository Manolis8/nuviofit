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

    // Send a prettier HTML page
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribed</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
          }
          .card {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
          }
          h1 {
            color: #28a745;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
          }
          a.button {
            display: inline-block;
            text-decoration: none;
            background-color: #0070f3;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            transition: background-color 0.3s;
          }
          a.button:hover {
            background-color: #005bb5;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>✅ You have been unsubscribed</h1>
          <p>You will no longer receive marketing emails from us.</p>
          <a href="https://nuviofit.com/dashboard" class="button">Go to Dashboard</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid or expired token.');
  }
}

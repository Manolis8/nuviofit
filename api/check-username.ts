// server.ts or app.ts (Node.js/Express example)
import express from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.get('/api/check-username', async (req, res) => {
  const username = req.query.username as string | undefined;

  if (!username || username.trim().length === 0) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Get users matching the username query
    const users = await clerkClient.users.getUserList({
      limit: 10,
      query: username,
    }) || [];

    // Defensive check in case `users` is undefined
    if (!Array.isArray(users)) {
      return res.status(500).json({ error: 'Invalid data from Clerk API' });
    }

    // Check if username exists (case-insensitive)
    const exists = users.some(
      user => user.username?.toLowerCase() === username.toLowerCase()
    );

    return res.json({ exists });
  } catch (err) {
    console.error('Clerk API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

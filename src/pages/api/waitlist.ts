import { supabaseAdmin } from "../../components/lib/supabaseAdmin";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    user_id,
    email,
    username,
    nutrition,
    meditation,
    goal_tracking,
    smartwatch_sync,
  } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('waitlist_features')
      .upsert({
        user_id,
        email,
        username,
        nutrition,
        meditation,
        goal_tracking,
        smartwatch_sync,
      }, { onConflict: 'user_id' });

    if (error) throw error;

    res.status(200).json({ message: 'Success', data });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to save data' });
  }
}



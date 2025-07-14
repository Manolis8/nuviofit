import { supabase } from "@/components/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    user_id,
    email,
    username,
    smartwatch_sync,
    goal_tracking,
    nutrition,
    meditation,
  } = req.body;

  try {
    const { data, error } = await supabase.from('waitlist_features').upsert(
      {
        user_id,
        email,
        username,
        smartwatch_sync,
        goal_tracking,
        nutrition,
        meditation,
      },
      { onConflict: 'user_id' }
    );

    if (error) throw error;

    res.status(200).json({ message: 'Success', data });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to save data' });
  }
}

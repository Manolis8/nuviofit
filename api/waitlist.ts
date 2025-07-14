// pages/api/waitlist.ts
import { supabaseAdmin } from "@/components/lib/supabaseAdmin";  // This uses the service role key.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { user_id, email, username, smartwatch_sync, goal_tracking, nutrition, meditation } = req.body;

    const { data, error } = await supabaseAdmin.from("waitlist_features").upsert(
      {
        user_id,
        email,
        username,
        smartwatch_sync,
        goal_tracking,
        nutrition,
        meditation,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    res.status(200).json({ message: "Success", data });
  } catch (error: any) {
    console.error("API ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to save data", details: error });
  }
}


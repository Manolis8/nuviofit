import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../src/components/lib/supabaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
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

  if (!user_id || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("waitlist")   // Your table name
      .insert([
        {
          user_id,
          email,
          username,
          nutrition,
          meditation,
          goal_tracking,
          smartwatch_sync,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ message: error.message });
    }

    res.status(200).json({ message: "Waitlist entry created", data });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

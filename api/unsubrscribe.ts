import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "" // must be service role
);

export default async function unsubscribe(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).send("Invalid request");
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.UNSUBSCRIBE_SECRET ?? "supersecret"
    ) as { email: string };

    const { error } = await supabase
      .from("onboarding_responses")
      .update({ unsubscribed: true })
      .eq("email", payload.email);

    if (error) {
      console.error("Error unsubscribing:", error);
      return res.status(500).send("Failed to unsubscribe");
    }

    // Redirect to success page
    res.redirect("/unsubscribe-success");

  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(400).send("Invalid or expired link");
  }
}

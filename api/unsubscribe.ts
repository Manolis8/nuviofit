// /pages/api/unsubscribe.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/components/lib/supabaseClient";
import jwt from "jsonwebtoken";

export default async function unsubscribe(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  // Basic check for token 
  if (!token || typeof token !== "string") {
    return res.status(200).send(renderPage("Invalid request", "The unsubscribe link is missing or invalid."));
  }

  try {
    const payload = jwt.verify(token, process.env.UNSUBSCRIBE_SECRET ?? "supersecret") as { email: string };

    const { error } = await supabase
      .from("onboarding_responses")
      .update({ unsubscribed: true })
      .eq("email", payload.email);

    if (error) {
      console.error("Error unsubscribing:", error);
      return res.status(200).send(renderPage("Unsubscribe Failed", "We couldn’t process your request. Please try again later."));
    }

    // Success page
    return res.status(200).send(renderPage("Unsubscribed!", "You have successfully unsubscribed from our emails."));
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(200).send(renderPage("Invalid or Expired Link", "Your unsubscribe link is invalid or has expired."));
  }
}

// Simple HTML renderer for the page
function renderPage(title: string, message: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f0f0f0; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .container { background: #fff; padding: 40px; border-radius: 10px; text-align: center; max-width: 500px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        h1 { color: #38B2AC; margin-bottom: 20px; }
        p { font-size: 16px; color: #555; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${title}</h1>
        <p>${message}</p>
      </div>
    </body>
    </html>
  `;
}


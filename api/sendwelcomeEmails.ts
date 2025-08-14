import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/components/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Unsubscribe via GET request with token
  if (req.method === "GET") {
    const token = req.query.token as string;
    if (!token) return res.status(400).send("Missing token");

    const { data, error } = await supabase
      .from("onboarding_responses")
      .update({ unsubscribed: true })
      .eq("id", token);

    if (error) return res.status(500).send("Failed to unsubscribe");
    return res.send("<h1>You have been unsubscribed successfully ✅</h1>");
  }

  // Send welcome email via POST request
  if (req.method === "POST") {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "Missing email or username" });
    }

    // Fetch user from Supabase
    const { data: userData, error: userError } = await supabase
      .from("onboarding_responses")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userData.id;

  const htmlContent = `
<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Welcome to NuvioFit</title>
      </head>
      <body style="background:#f0f0f0; padding: 30px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 20px; color: #222;">
          <h1 style="color: #63B3ED;">Welcome to the Club, ${username}! 👋</h1>
          <p style="font-size: 18px; margin-top: 10px;">
            We're thrilled to have you join the NuvioFit movement.
          </p>

          <h2 style="color: #38B2AC; margin-top: 30px;">Why We Exist & Our Mission</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            To empower people to master their body and mind through AI-driven, personalized health coaching that adapts to their real life — not just their routine.<br><br>
            We help people build consistent habits in fitness, nutrition, mindfulness, and recovery through one unified, intelligent platform.
          </p>

          <h2 style="color: #38B2AC; margin-top: 30px;">🔮 Our Vision for the Future</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            At NuvioFit, our vision reaches beyond fitness. We aim to reshape the future of health and wellness by creating technologies that help people master both body and mind, through systems that adapt, understand, and empower.<br><br>

            We are not building “just another app.” We are laying the foundation for a revolutionary ecosystem that will redefine how people achieve health, resilience, and balance — mentally and physically.<br><br>

            We envision a world where health technology isn’t just reactive, but predictive. Not generic, but deeply personal. Not focused on trends, but on transforming lives.<br><br>

            We will thrive to lead a movement — a future where people don’t rely on guesswork or motivation alone. Instead, they are equipped with intelligent tools that evolve with them, understand their unique challenges, and guide them to lasting results.<br><br>

            Our long-term mission is clear:<br>
            To build revolutionary products that transform not just individuals, but society’s relationship with health. We want our technology to inspire a generation to live with purpose, strength, and mental clarity — to reshape health culture for decades to come.<br><br>

            This is bigger than fitness. This is about changing how people think, live, and succeed. This is how we will write our name in history.
          </p>

          <div style="margin-top: 50px; text-align: center;">
            <p style="font-size: 18px; font-weight: 600; color: #38B2AC;">
              You’re officially part of this movement — and we can’t wait to see what you achieve!
            </p>
            <p style="font-size: 16px; margin-bottom: 30px;">
              Start your personalized journey now by visiting your dashboard.
            </p>
            <a href="https://www.nuviofit.com/dashboard" target="_blank" rel="noopener noreferrer"
               style="
                 display: inline-block; 
                 background: linear-gradient(90deg, #63B3ED 0%, #38B2AC 100%);
                 color: white; 
                 padding: 14px 30px; 
                 border-radius: 8px; 
                 text-decoration: none; 
                 font-weight: 700; 
                 font-size: 18px;
                 box-shadow: 0 4px 15px rgba(56, 178, 172, 0.5);
                 transition: background 0.3s ease;
               ">
              Go to Your Dashboard
            </a>
          </div>

          <p style="margin-top: 40px; text-align: center; font-style: italic; color: #777;">
            — The NuvioFit Team
          </p>

          <p style="margin-top: 20px; font-size: 14px; color: #777; text-align: center;">
  If you want to stop receiving these emails, 
  <a href="https://www.nuviofit.com/unsubscribe?token=${userId}" 
     style="color: #38B2AC; text-decoration: underline;">
     unsubscribe here
  </a>.
</p>

        </div>
      </body>
      </html>
  `;

   try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "NuvioFit", email: "movement@nuviofit.com" },
          to: [{ email, name: username }],
          subject: "Welcome to the Club!",
          htmlContent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(500).json({ message: "Failed to send email", detail: errorText });
      }

      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: "Server error sending email" });
    }
  }

  // Invalid method
  res.setHeader("Allow", ["POST", "GET"]);
  return res.status(405).json({ message: "Method not allowed" });
}

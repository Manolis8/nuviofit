import type { NextApiRequest, NextApiResponse } from "next";

export default async function sendEmails(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    console.warn("⛔ Invalid method:", req.method);
    return res.status(405).json({ message: "Only POST method is allowed" });
  }

  const { email, username } = req.body;

  console.log("📩 Incoming request to send welcome email");
  console.log("👉 Email:", email);
  console.log("👉 Username:", username);

  if (!email || !username) {
    console.error("❌ Missing email or username in request");
    return res.status(400).json({ message: "Missing email or username" });
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color:#63B3ED;">Welcome to the Club, ${username}!</h1>
        <p>We’re thrilled to have you join the NuvioFit movement.</p>
        <p>Start your personalized journey now by visiting your dashboard:</p>
        <a href="https://www.nuviofit.com/dashboard"
           style="display:inline-block;background:#63B3ED;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
          Go to Your Dashboard
        </a>
        <p style="margin-top: 30px; color: #777;">— The NuvioFit Team</p>
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
      console.error("❌ Brevo API error:", errorText);
      return res.status(500).json({ message: "Failed to send email", detail: errorText });
    }

    console.log(`✅ Welcome email sent to ${email}`);
    return res.status(200).json({ message: "Email sent successfully" });

  } catch (error: any) {
    console.error("❌ Server error while sending email:", error.message || error);
    return res.status(500).json({ message: "Server error sending email" });
  }
}

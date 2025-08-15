// src/pages/api/testSend.ts
import fetch from "node-fetch"; // Only needed if Node < 18

export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.nuviofit.com/api/sendwelcomeEmails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "manolistsiftsis@gmail.com",
        username: "TestUser",
      }),
    });

    const data = await response.json();
    console.log("Response:", data);

    res.status(200).json({ message: "Email sent successfully", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email", error: err });
  }
}

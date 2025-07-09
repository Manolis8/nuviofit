import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages array" });
  }

  try {
    // Example: using OpenAI's official library
    const reply = "Fake fitness plan response here"; // Replace with real OpenAI logic

    return res.status(200).json({ reply }); // <- important: must return JSON!
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}

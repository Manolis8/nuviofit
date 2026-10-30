import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-nano";
const MAX_MESSAGES = 40;
const MAX_TOTAL_CHARS = 60_000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set on the server." });
  }

  const { messages } = req.body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid messages array" });
  }

  // Basic abuse guard: this endpoint spends OpenAI credits, so cap the request size.
  const totalChars = messages.reduce((sum, m) => sum + String(m?.content ?? "").length, 0);
  if (messages.length > MAX_MESSAGES || totalChars > MAX_TOTAL_CHARS) {
    return res.status(413).json({ error: "Request too large" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}

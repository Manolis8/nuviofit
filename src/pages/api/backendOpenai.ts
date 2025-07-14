import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Missing messages" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages,
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "OpenAI error" });
  }
}


import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    const response = await fetch(`https://api.clerk.dev/v1/users?username=${username}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const users = await response.json();

    if (Array.isArray(users) && users.length > 0) {
      return res.status(200).json({ available: false });
    }

    return res.status(200).json({ available: true });
  } catch (err) {
    console.error("Check username error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// /pages/api/check-username.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  if (typeof username !== "string") {
    return res.status(400).json({ error: "Invalid username" });
  }

  try {
    const clerkRes = await fetch(
      `https://api.clerk.com/v1/users?username=${encodeURIComponent(username)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );

    const users = await clerkRes.json();

    if (Array.isArray(users) && users.length > 0) {
      return res.status(200).json({ status: "taken" });
    }

    return res.status(200).json({ status: "available" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error" });
  }
}

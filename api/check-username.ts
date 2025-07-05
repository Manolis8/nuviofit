export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) return res.status(400).json({ availability: "error" });

  try {
    const response = await fetch(`https://api.clerk.dev/v1/users?username=${username}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const users = await response.json();
    const isTaken = users.length > 0;
    res.status(200).json({ availability: isTaken ? "taken" : "available" });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ availability: "error" });
  }
}

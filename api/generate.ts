import { generateFitnessPlan } from "@/components/lib/generateFitnessPlan"; // adjust path as needed

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in request body" });
  }

  try {
    const plan = await generateFitnessPlan(userId);
    return res.status(200).json({ plan });
  } catch (error) {
    console.error("Failed to generate plan:", error.message);
    return res.status(500).json({ error: "Failed to generate plan" });
  }
}
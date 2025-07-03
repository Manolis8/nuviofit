// src/lib/sendFeedback.ts

export async function sendFeedback({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const feedback_url =
    import.meta.env?.VITE_FEEDBACK_URL || process.env.FEEDBACK_URL;

  if (!feedback_url) {
    throw new Error("Feedback URL is not defined in the environment.");
  }

  const formBody = new URLSearchParams({ name, email, message }).toString();

  const res = await fetch(feedback_url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody,
  });

  if (!res.ok) throw new Error("Feedback submission failed.");
}

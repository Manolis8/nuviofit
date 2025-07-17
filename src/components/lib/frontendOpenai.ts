export async function getOpenAIResponse(messages: any[]) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error("OpenAI API Error: " + error);
  }

  const data = await response.json();
  console.log("API response data:", data); // Debug log

  if (!data.reply) {
    throw new Error("No reply field in API response");
  }

  return data.reply;
}

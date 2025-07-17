// src/lib/getOpenAIResponse.ts
export async function getOpenAIResponse(prompt: string) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // REMOVE Authorization header here — backend handles API key securely
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are a helpful personal trainer." },
        { role: "user", content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error("OpenAI API Error: " + error);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

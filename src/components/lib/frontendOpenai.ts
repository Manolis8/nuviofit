// src/lib/getOpenAIResponse.ts
export async function getOpenAIResponse(messages: any) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-nano",
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error("OpenAI API Error: " + error);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

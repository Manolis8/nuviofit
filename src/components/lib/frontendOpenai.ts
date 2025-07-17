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
  return data.choices[0].message.content;
}

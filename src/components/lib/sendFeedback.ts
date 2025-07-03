export async function sendFeedback(feedback: string) {
  const response = await fetch('https://script.google.com/macros/s/AKfycbwbw_VuerpxmTMgl5KTNG5I_DJGDBr_03SyuYpKkCg8vOF-ebres3mCe9sqq3shDhtt/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feedback }),
  });

  if (!response.ok) {
    throw new Error('Failed to send feedback');
  }

  const data = await response.json();
  return data;
}

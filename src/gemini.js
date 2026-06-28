export async function askGemini(key, question) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: question }] }),
  });
  if (!response.ok) throw new Error('Invalid API Key or Request Failed');
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

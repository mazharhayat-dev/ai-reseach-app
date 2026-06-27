const GEMINI_MODEL = 'gemini-1.5-flash';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

function buildUrl(apiKey) {
  return `${BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
}

async function callGem(apiKey, text) {
  const response = await fetch(buildUrl(apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
    }),
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!answer) {
    throw new Error('No response from Gemini');
  }

  return answer;
}

export async function testConnection(apiKey) {
  await callGem(apiKey, 'Hello');
}

export async function askGem(apiKey, question) {
  return callGem(apiKey, question);
}

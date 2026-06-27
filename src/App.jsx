import { useState } from 'react';
import { testConnection, askGem } from './gemini.js';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState('');

  async function handleConnect() {
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      setConnectionMessage('Please enter your API Key');
      setIsConnected(false);
      return;
    }

    setIsConnecting(true);
    setConnectionMessage('');

    try {
      await testConnection(trimmedKey);
      setIsConnected(true);
      setConnectionMessage('● Connected');
    } catch {
      setIsConnected(false);
      setConnectionMessage('● Connection Failed: Invalid API Key');
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleAsk() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setAskError('Please enter a research question.');
      return;
    }

    setIsAsking(true);
    setAskError('');
    setAnswer('');

    try {
      const response = await askGem(apiKey.trim(), trimmedQuestion);
      setAnswer(response);
    } catch {
      setAskError('Failed to get a response. Please check your connection and try again.');
    } finally {
      setIsAsking(false);
    }
  }

  const connectionFailed = connectionMessage.includes('Connection Failed');
  const connectionEmpty = connectionMessage === 'Please enter your API Key';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-3 text-center text-sm text-yellow-900">
        🛡️ Local Privacy First: Your Gemini API key is utilized strictly inside your local browser. No third-party servers store your information.
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            💼 ResearchMate AI - Your Research Assistant Co-Pilot
          </h1>
        </header>

        {!isConnected ? (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <label htmlFor="api-key" className="mb-2 block text-sm font-medium text-slate-700">
              API Key
            </label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API Key..."
              className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mb-4 text-xs text-slate-500">
              Get your key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Google AI Studio
              </a>
            </p>

            <button
              type="button"
              onClick={handleConnect}
              disabled={isConnecting}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isConnecting ? 'Connecting...' : '⚡ Connect & Test'}
            </button>

            {connectionMessage && (
              <p
                className={`mt-4 text-sm font-medium ${
                  connectionFailed || connectionEmpty
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {connectionMessage}
              </p>
            )}
          </section>
        ) : (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-6 text-sm font-medium text-green-600">● Connected</p>

            <label htmlFor="question" className="mb-2 block text-sm font-medium text-slate-700">
              Research Question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your research question..."
              rows={4}
              className="mb-4 w-full resize-y rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <button
              type="button"
              onClick={handleAsk}
              disabled={isAsking}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAsking ? 'Thinking...' : 'Ask Gemini'}
            </button>

            {askError && (
              <p className="mt-4 text-sm font-medium text-red-600">{askError}</p>
            )}

            {answer && (
              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h2 className="mb-2 text-sm font-semibold text-slate-700">Answer</h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {answer}
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

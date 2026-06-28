import { useState } from 'react';
import { askGemini } from '@/gemini.js'

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState('');

  const handleConnect = () => {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setConnectionMessage('Please enter your API Key');
      setIsConnected(false);
      return;
    }
    // Bas key ko localStorage me save kar diya. API call nahi hogi yahan
    localStorage.setItem('GEMINI_API_KEY', trimmedKey);
    setIsConnected(true);
    setConnectionMessage('✓ Key Saved');
  };

  const handleAsk = async () => {
    const trimmedQuestion = question.trim();
    const savedKey = localStorage.getItem('GEMINI_API_KEY');

    if (!savedKey) {
      setAskError('Please enter and save your API Key first.');
      return;
    }
    if (!trimmedQuestion) {
      setAskError('Please enter a research question.');
      return;
    }

    setIsAsking(true);
    setAskError('');
    setAnswer('');

    try {
      // Ab ye asli API call karega browser me
      const result = await askGemini(savedKey, trimmedQuestion);
      setAnswer(result);
    } catch (error) {
      setAskError(`Error: ${error.message}`);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>AI Research App</h1>

      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>1. Enter Your Gemini API Key</h3>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIza..."
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button onClick={handleConnect} disabled={isConnected}>
          {isConnected? 'Connected' : 'Save Key'}
        </button>
        <p>{connectionMessage}</p>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <h3>2. Ask a Question</h3>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something..."
          rows="3"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button onClick={handleAsk} disabled={isAsking}>
          {isAsking? 'Asking...' : 'Ask Gemini'}
        </button>
        {askError && <p style={{ color: 'red' }}>{askError}</p>}
        {answer && <div style={{ marginTop: '15px', whiteSpace: 'pre-wrap' }}><h4>Answer:</h4> {answer}</div>}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { askGemini } from './gemini.js';

function App() {
  const [key, setKey] = useState('');
  const [q, setQ] = useState('');
  const [ans, setAns] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setAns('');
    try {
      const res = await askGemini(key, q);
      setAns(res);
    } catch (e) {
      setAns('Error: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto'}}>
      <h1>AI ResearchMate</h1>
      <input placeholder="Gemini API Key" type="password" value={key} onChange={e => setKey(e.target.value)} style={{width: '100%', padding: '8px', marginBottom: '10px'}} />
      <textarea placeholder="Apna sawal likho..." value={q} onChange={e => setQ(e.target.value)} style={{width: '100%', height: '100px', padding: '8px'}} />
      <button onClick={handleAsk} disabled={loading} style={{marginTop: '10px', padding: '10px 20px'}}>
        {loading ? 'Socha raha hai...' : 'Poochho'}
      </button>
      {ans && <div style={{marginTop: '20px', whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '10px'}}>{ans}</div>}
    </div>
  );
}
export default App;

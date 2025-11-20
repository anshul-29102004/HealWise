import React, { useState } from 'react';

const SymptomChecker = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Replace with your backend endpoint that calls OpenAI
      const response = await fetch('http://localhost:4000/api/symptom-checker', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ symptoms: input })
});

      const data = await response.json();
      if (data.specialty) {
        setResult(data.specialty);
      } else {
        setError(data.message || 'No recommendation found.');
      }
    } catch {
      setError('Error connecting to AI service.');
    }
    setLoading(false);
  };

  return (
  <div className="max-w-xl mx-auto py-10 px-4">
  <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">AI Symptom Checker</h2>
  <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <textarea
          className="border rounded p-3 text-gray-700 min-h-[80px]"
          placeholder="Describe your symptoms or disease names..."
          value={input}
          onChange={e => setInput(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-[#5f6FFF] text-white py-2 px-4 rounded hover:bg-[#4a54e1] transition-all"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Find Doctor Type'}
        </button>
      </form>
      {result && (
  <div className="bg-green-50 border border-green-200 rounded p-4 text-green-800 text-center mb-4">
          <b>Recommended Doctor Specialty:</b> <br />
          <span className="text-lg font-semibold">{result}</span>
        </div>
      )}
      {error && (
  <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800 text-center mb-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
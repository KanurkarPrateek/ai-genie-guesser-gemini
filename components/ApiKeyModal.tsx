import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string) => void;
  existingKey?: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit, existingKey }) => {
  const [apiKey, setApiKey] = useState(existingKey || '');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-md w-full border border-slate-700">
        <h2 className="text-2xl font-bold text-purple-300 mb-2">API Key Required</h2>
        <p className="text-slate-300 mb-4 text-sm">
          Enter your Google Gemini API key to start playing. Get one from{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            Google AI Studio
          </a>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-300 mb-2 text-sm font-semibold">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-3 bg-slate-900 border-2 border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-20"
                placeholder="AIza..."
                required
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors duration-200 font-bold shadow-lg"
            >
              Save & Play
            </button>
          </div>
        </form>
        <p className="text-xs text-slate-500 mt-4">
          Your API key is stored locally in your browser and never sent anywhere except Google's API.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;

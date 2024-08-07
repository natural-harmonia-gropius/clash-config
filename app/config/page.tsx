"use client";

import { useState } from 'react';

const ConfigPage = () => {
  const [proxy, setProxy] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const currentUrl = window.location.origin;
    const fullUrl = `${currentUrl}/api/config?proxy=${encodeURIComponent(proxy)}`;
    setUrl(fullUrl);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="proxy" className="block text-sm font-medium text-gray-700">Clash Subscription Link</label>
            <input
              id="proxy"
              type="text"
              value={proxy}
              onChange={(e) => setProxy(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Convert URL
          </button>
        </form>
        {url && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="break-words font-mono">{url}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
        <div>
          <a href="/api/mmdb" className="text-indigo-600 hover:underline">Download Country.mmdb</a>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
        <div>
          <a href="/api/winsw" className="text-indigo-600 hover:underline">Download WinSW</a>
        </div>
        <div>
          <a href="/api/winsw-xml" className="text-indigo-600 hover:underline">Download WinSW XML</a>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="font-mono">winsw install winsw.xml</p>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;

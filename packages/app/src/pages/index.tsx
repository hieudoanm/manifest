import { manifest as pwaManifest } from '@manifest.json/json/pwa/manifest';
import { manifest as extensionManifest } from '@manifest.json/json/extension/manifest';
import { NextPage } from 'next';
import { useState } from 'react';

const HomePage: NextPage = () => {
  const [
    { type = 'pwa', manifest = JSON.stringify(pwaManifest, null, 2) },
    setState,
  ] = useState<{
    type: 'pwa' | 'extension';
    manifest: string;
  }>({ type: 'pwa', manifest: JSON.stringify(pwaManifest, null, 2) });

  return (
    <div className="divide-base-300 flex h-screen w-screen flex-col divide-y overflow-hidden">
      <nav className="bg-base-300 shadow-2xl">
        <div className="container mx-auto px-4 py-2 md:px-8 md:py-4">
          <div className="flex items-center justify-between">
            <span>manifest.json</span>
            <button
              type="button"
              className="btn btn-xs btn-primary"
              onClick={() => {
                const newType = type === 'pwa' ? 'extension' : 'pwa';
                const newManifest =
                  type === 'pwa'
                    ? JSON.stringify(extensionManifest, null, 2)
                    : JSON.stringify(pwaManifest, null, 2);
                setState((previous) => ({
                  ...previous,
                  type: newType,
                  manifest: newManifest,
                }));
              }}>
              {type === 'pwa' ? 'Extension' : 'PWA'}
            </button>
          </div>
        </div>
      </nav>
      <div className="grow">
        <div className="container mx-auto h-full w-full p-4 md:p-8">
          <textarea
            id="pwa.manifest.json"
            name="pwa.manifest.json"
            placeholder="PWA Manifest.json"
            className="border-base-300 bg-base-300 h-full w-full rounded-lg border p-4 shadow-2xl md:p-8"
            value={manifest}
            onChange={(event) => {
              setState((previous) => ({
                ...previous,
                manifest: event.target.value,
              }));
            }}></textarea>
        </div>
      </div>
      <footer className="bg-base-300 shadow-2xl">
        <div className="container mx-auto px-4 py-2 md:px-8 md:py-4">
          <button type="button" className="btn btn-primary w-full">
            Copy
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

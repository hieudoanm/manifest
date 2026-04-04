import { manifest as pwaManifest } from '@manifest/json/pwa/manifest';
import { manifest as extensionManifest } from '@manifest/json/extension/manifest';
import { NextPage } from 'next';
import { useState } from 'react';

const EditorPage: NextPage = () => {
  const [{ type, manifest }, setState] = useState<{
    type: 'pwa' | 'extension';
    manifest: string;
  }>({ type: 'pwa', manifest: JSON.stringify(pwaManifest, null, 2) });
  const [copied, setCopied] = useState(false);

  const toggle = () => {
    const newType = type === 'pwa' ? 'extension' : 'pwa';
    setState({
      type: newType,
      manifest:
        newType === 'pwa'
          ? JSON.stringify(pwaManifest, null, 2)
          : JSON.stringify(extensionManifest, null, 2),
    });
  };

  const copy = async () => {
    await navigator.clipboard.writeText(manifest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-theme="luxury"
      className="bg-base-100 relative flex h-screen w-screen flex-col overflow-hidden">
      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Top gold rule */}
      <div className="via-primary fixed top-0 right-0 left-0 z-20 h-[3px] bg-gradient-to-r from-transparent to-transparent" />

      {/* Nav */}
      <nav className="border-primary/10 relative z-10 shrink-0 border-b px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-primary/40 text-[0.55rem] tracking-[0.4em] uppercase">
              manifest
            </span>
            <div className="bg-primary/20 h-3 w-px" />
            <span className="text-base-content font-serif text-sm font-bold tracking-wider">
              Editor
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Type toggle */}
            <div className="border-primary/20 flex items-center border">
              <button
                onClick={() => type !== 'pwa' && toggle()}
                className={[
                  'px-3 py-1 text-[0.55rem] tracking-[0.2em] uppercase transition-all duration-200',
                  type === 'pwa'
                    ? 'bg-primary text-primary-content'
                    : 'text-primary/40 hover:text-primary',
                ].join(' ')}>
                PWA
              </button>
              <div className="bg-primary/20 h-3 w-px" />
              <button
                onClick={() => type !== 'extension' && toggle()}
                className={[
                  'px-3 py-1 text-[0.55rem] tracking-[0.2em] uppercase transition-all duration-200',
                  type === 'extension'
                    ? 'bg-primary text-primary-content'
                    : 'text-primary/40 hover:text-primary',
                ].join(' ')}>
                Extension
              </button>
            </div>
            <a
              href="/"
              className="text-primary/40 hover:text-primary text-[0.55rem] tracking-[0.3em] uppercase transition-colors duration-200">
              ← Back
            </a>
          </div>
        </div>
      </nav>

      {/* Editor */}
      <main className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* File tab bar */}
        <div className="border-primary/10 bg-base-200/20 flex shrink-0 items-center gap-0 border-b">
          <div className="border-primary/30 flex items-center gap-2 border-r px-4 py-2">
            <span className="text-primary text-[0.6rem] tracking-[0.2em]">
              manifest
            </span>
            <span className="text-primary/30 text-[0.5rem] tracking-[0.15em] uppercase">
              {type}
            </span>
          </div>
        </div>

        {/* Textarea fills remaining height */}
        <div className="relative flex flex-1 overflow-hidden">
          {/* Line numbers */}
          <div className="border-primary/10 bg-base-200/10 text-base-content/20 w-10 shrink-0 overflow-hidden border-r px-3 py-4 text-right font-mono text-[0.65rem] leading-relaxed select-none">
            {manifest.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            className="text-base-content/75 flex-1 resize-none bg-transparent p-4 font-mono text-[0.7rem] leading-relaxed outline-none"
            value={manifest}
            onChange={(e) =>
              setState((prev) => ({ ...prev, manifest: e.target.value }))
            }
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </main>

      {/* Footer / copy bar */}
      <footer className="border-primary/10 relative z-10 shrink-0 border-t px-6 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <span className="text-base-content/20 text-[0.5rem] tracking-[0.2em] uppercase">
            {manifest.split('\n').length} lines · {new Blob([manifest]).size}{' '}
            bytes
          </span>
          <button
            onClick={copy}
            className={[
              'btn btn-sm rounded-none px-8 text-[0.6rem] tracking-[0.3em] uppercase transition-all duration-300',
              copied ? 'btn-success' : 'btn-primary',
            ].join(' ')}>
            {copied ? 'Copied ✓' : 'Copy to Clipboard'}
          </button>
        </div>
      </footer>

      {/* Bottom gold rule */}
      <div className="via-primary fixed right-0 bottom-0 left-0 z-20 h-[3px] bg-gradient-to-r from-transparent to-transparent" />
    </div>
  );
};

export default EditorPage;

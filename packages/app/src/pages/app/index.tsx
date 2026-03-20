import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

const TOOLS = [
  {
    id: 'editor',
    href: '/app/editor',
    title: 'Editor',
    subtitle: 'JSON Editor',
    description:
      'Edit and copy your PWA or Chrome Extension manifest.json with a live editor.',
    meta: 'PWA · Extension',
    symbol: '{ }',
    symbolClass:
      'text-[3.5rem] font-mono font-bold leading-none tracking-tighter',
  },
  {
    id: 'icons',
    href: '/app/icons',
    title: 'Icons',
    subtitle: 'PNG Generator',
    description:
      'Drop a 512×512 PNG and export every standard manifest icon size in one click.',
    meta: '8 sizes · 72 → 512 px',
    symbol: '↓',
    symbolClass: 'text-[5rem] font-serif font-bold leading-none',
  },
];

const AppPage: NextPage = () => {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      data-theme="luxury"
      className="bg-base-100 relative flex min-h-screen w-screen flex-col items-center justify-center overflow-hidden">
      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Top gold rule */}
      <div className="via-primary fixed top-0 right-0 left-0 z-20 h-[3px] bg-gradient-to-r from-transparent to-transparent" />

      {/* Header */}
      <div className="relative z-10 mb-16 flex flex-col items-center gap-3 text-center">
        <span className="text-primary/40 text-[0.55rem] tracking-[0.5em] uppercase">
          Developer Tools
        </span>
        <h1 className="text-base-content font-serif text-4xl font-bold tracking-wide">
          manifest.json
        </h1>
        <div className="mt-1 flex items-center gap-3">
          <div className="bg-primary/30 h-px w-12" />
          <div className="bg-primary h-1 w-1 rounded-full" />
          <div className="bg-primary/30 h-px w-12" />
        </div>
        <p className="text-base-content/35 mt-1 text-[0.65rem] tracking-[0.2em] uppercase">
          Select a tool to begin
        </p>
      </div>

      {/* Tool cards */}
      <div className="border-primary/10 relative z-10 flex w-full max-w-2xl flex-col border sm:flex-row">
        {TOOLS.map((tool, i) => {
          const isHovered = hovered === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => router.push(tool.href)}
              onMouseEnter={() => setHovered(tool.id)}
              onMouseLeave={() => setHovered(null)}
              className={[
                'group relative flex flex-1 flex-col items-center justify-between gap-8',
                'cursor-pointer px-12 py-12 text-center',
                'transition-all duration-500 outline-none',
                i < TOOLS.length - 1
                  ? 'border-primary/10 border-b sm:border-r sm:border-b-0'
                  : '',
                isHovered ? 'bg-primary/[0.05]' : 'bg-transparent',
              ].join(' ')}>
              {/* Number */}
              <span className="text-primary/20 self-start text-[0.5rem] tracking-[0.4em] uppercase">
                0{i + 1}
              </span>

              {/* Symbol */}
              <div
                className={[
                  'transition-all duration-500',
                  isHovered
                    ? 'text-primary scale-110 opacity-90'
                    : 'text-base-content opacity-20',
                ].join(' ')}>
                <span className={tool.symbolClass}>{tool.symbol}</span>
              </div>

              {/* Text */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-0.5">
                  <h2 className="text-base-content font-serif text-lg font-bold tracking-wider">
                    {tool.title}
                  </h2>
                  <span className="text-primary/50 text-[0.6rem] tracking-[0.3em] uppercase">
                    {tool.subtitle}
                  </span>
                </div>
                <div className="bg-primary/15 my-1 h-px w-8" />
                <p className="text-base-content/35 max-w-[200px] text-[0.65rem] leading-relaxed tracking-wide">
                  {tool.description}
                </p>
                <span className="text-primary/25 mt-1 text-[0.55rem] tracking-[0.2em] uppercase">
                  {tool.meta}
                </span>
              </div>

              {/* CTA */}
              <div
                className={[
                  'flex items-center gap-2 transition-all duration-300',
                  isHovered
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-1 opacity-0',
                ].join(' ')}>
                <span className="text-primary text-[0.6rem] tracking-[0.3em] uppercase">
                  Open
                </span>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 8h8M8 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Bottom glow */}
              <div
                className={[
                  'via-primary absolute right-0 bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent to-transparent transition-all duration-500',
                  isHovered ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
              />
            </button>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="relative z-10 mt-12 text-center">
        <p className="text-base-content/15 text-[0.5rem] tracking-[0.25em] uppercase">
          All processing runs in the browser · no data is uploaded
        </p>
      </div>

      {/* Bottom gold rule */}
      <div className="via-primary fixed right-0 bottom-0 left-0 z-20 h-[3px] bg-gradient-to-r from-transparent to-transparent" />
    </div>
  );
};

export default AppPage;

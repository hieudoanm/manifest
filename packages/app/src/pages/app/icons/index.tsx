import { NextPage } from 'next';
import { useCallback, useRef, useState } from 'react';

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

type GeneratedIcon = {
  size: number;
  dataUrl: string;
  canvas: HTMLCanvasElement;
};

function resizeImage(img: HTMLImageElement, size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, size, size);
  return canvas;
}

const IconsPage: NextPage = () => {
  const [icons, setIcons] = useState<GeneratedIcon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    setError(null);
    setIcons([]);

    if (file.type !== 'image/png') {
      setError('Only PNG files are accepted.');
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      if (img.width !== 512 || img.height !== 512) {
        setError(
          `Image must be 512×512 px. Yours is ${img.width}×${img.height}.`
        );
        URL.revokeObjectURL(url);
        return;
      }

      const generated: GeneratedIcon[] = SIZES.map((size) => {
        const canvas = resizeImage(img, size);
        return { size, dataUrl: canvas.toDataURL('image/png'), canvas };
      });

      setIcons(generated);
      setSourceName(file.name);
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      setError('Failed to load image.');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, []);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (files && files[0]) processFile(files[0]);
    },
    [processFile]
  );

  const downloadSingle = (icon: GeneratedIcon) => {
    const a = document.createElement('a');
    a.href = icon.dataUrl;
    a.download = `icon-${icon.size}x${icon.size}.png`;
    a.click();
  };

  const downloadAll = async () => {
    // Dynamic import of JSZip via script tag approach
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    document.head.appendChild(script);

    await new Promise((res) => (script.onload = res));

    // @ts-ignore
    const zip = new window.JSZip();
    const folder = zip.folder('icons');

    for (const icon of icons) {
      const blob = await new Promise<Blob>((res) =>
        icon.canvas.toBlob((b) => res(b!), 'image/png')
      );
      const buf = await blob.arrayBuffer();
      folder.file(`icon-${icon.size}x${icon.size}.png`, buf);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'icons.zip';
    a.click();
  };

  return (
    <div
      data-theme="luxury"
      className="bg-base-100 relative flex min-h-screen w-screen flex-col overflow-hidden">
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
      <nav className="border-primary/10 relative z-10 border-b px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-primary/40 text-[0.55rem] tracking-[0.4em] uppercase">
              manifest.json
            </span>
            <div className="bg-primary/20 h-3 w-px" />
            <span className="text-base-content font-serif text-sm font-bold tracking-wider">
              Icon Generator
            </span>
          </div>
          <a
            href="/"
            className="text-primary/40 hover:text-primary text-[0.55rem] tracking-[0.3em] uppercase transition-colors duration-200">
            ← Back
          </a>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/30 h-px w-8" />
            <span className="text-primary/50 text-[0.55rem] tracking-[0.4em] uppercase">
              Step 1
            </span>
          </div>
          <h1 className="text-base-content font-serif text-2xl font-bold tracking-wide">
            Drop a 512×512 PNG
          </h1>
          <p className="text-base-content/40 text-[0.7rem] tracking-wide">
            Generates all standard manifest icon sizes · 72 → 512 px
          </p>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={[
            'border-primary/20 flex cursor-pointer flex-col items-center justify-center gap-4 rounded-none border py-14 transition-all duration-300',
            dragging
              ? 'border-primary/60 bg-primary/5'
              : 'bg-base-200/30 hover:border-primary/40 hover:bg-primary/[0.03]',
          ].join(' ')}>
          <input
            ref={inputRef}
            type="file"
            accept="image/png"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {/* Icon */}
          <div className="border-primary/20 flex h-14 w-14 items-center justify-center border">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary/40">
              <path
                d="M12 16V8M12 8L9 11M12 8L15 11"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-base-content/60 text-sm font-light tracking-wide">
              {dragging
                ? 'Release to upload'
                : 'Drop PNG here or click to browse'}
            </span>
            <span className="text-base-content/25 text-[0.6rem] tracking-[0.2em] uppercase">
              Must be 512 × 512 px · PNG only
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="border-error/30 bg-error/5 flex items-center gap-3 border px-4 py-3">
            <span className="text-error text-xs tracking-wide">{error}</span>
          </div>
        )}

        {/* Results */}
        {icons.length > 0 && (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary/30 h-px w-8" />
                <span className="text-primary/50 text-[0.55rem] tracking-[0.4em] uppercase">
                  Step 2
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-base-content font-serif text-xl font-bold tracking-wide">
                    Generated Icons
                  </h2>
                  <p className="text-base-content/30 mt-0.5 text-[0.6rem] tracking-wide">
                    From: {sourceName}
                  </p>
                </div>
                <button
                  onClick={downloadAll}
                  className="btn btn-primary btn-sm rounded-none px-6 text-[0.6rem] tracking-[0.25em] uppercase">
                  Download ZIP
                </button>
              </div>
            </div>

            <div className="border-primary/10 grid grid-cols-4 gap-px border sm:grid-cols-8">
              {icons.map((icon) => (
                <button
                  key={icon.size}
                  onClick={() => downloadSingle(icon)}
                  className="group border-primary/10 bg-base-200/20 hover:bg-primary/5 flex flex-col items-center gap-3 border-r p-4 transition-all duration-200 last:border-r-0">
                  <img
                    src={icon.dataUrl}
                    alt={`${icon.size}x${icon.size}`}
                    className="h-10 w-10 object-contain"
                    style={{
                      imageRendering: icon.size <= 96 ? 'pixelated' : 'auto',
                    }}
                  />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-base-content/60 text-[0.6rem] font-medium tabular-nums">
                      {icon.size}
                    </span>
                    <span className="text-primary/0 group-hover:text-primary/40 text-[0.5rem] tracking-[0.15em] uppercase transition-all duration-200">
                      ↓ PNG
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-base-content/20 text-center text-[0.55rem] tracking-[0.2em] uppercase">
              Click any icon to download individually · or grab all as a ZIP
            </p>
          </>
        )}
      </main>

      {/* Bottom gold rule */}
      <div className="via-primary fixed right-0 bottom-0 left-0 z-20 h-[3px] bg-gradient-to-r from-transparent to-transparent" />
    </div>
  );
};

export default IconsPage;

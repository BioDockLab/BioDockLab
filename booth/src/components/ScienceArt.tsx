import type { CSSProperties, ReactNode } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function ScienceOrb({ type = 'brain', size = 120 }: { type?: 'brain' | 'cells' | 'neuron' | 'organoid'; size?: number }) {
  const nodeCount = type === 'neuron' ? 7 : type === 'cells' ? 9 : 12;
  return (
    <div className={`science-orb science-orb--${type}`} style={{ width: size, height: size }} aria-hidden="true">
      {Array.from({ length: nodeCount }, (_, index) => (
        <span
          key={index}
          style={{
            '--i': index,
            '--angle': `${(360 / nodeCount) * index}deg`,
            '--distance': `${size * (type === 'neuron' ? 0.34 : 0.24)}px`,
          } as CSSProperties}
        />
      ))}
      <i />
    </div>
  );
}

export function ProteinArt({ uncertain = false }: { uncertain?: boolean }) {
  return (
    <svg className="protein-art" viewBox="0 0 600 390" role="img" aria-label="교육용 단백질 구조 일러스트">
      <defs>
        <linearGradient id={`protein-${uncertain ? 'uncertain' : 'base'}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="0.52" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <g fill="none" stroke={`url(#protein-${uncertain ? 'uncertain' : 'base'})`} strokeLinecap="round">
        <path strokeWidth="17" d="M67 262 C68 127 204 59 290 151 C353 218 449 99 533 177 C604 244 483 350 390 284 C312 229 276 342 185 327 C105 314 91 217 151 169" />
        <path strokeWidth="11" d="M121 291 C180 234 164 126 253 117 C341 108 348 259 438 242 C493 231 514 272 474 312" />
        <path strokeWidth="8" d="M187 79 C235 111 207 193 274 222 C343 252 394 173 454 154" />
        <path strokeWidth="9" d="M245 330 C218 273 273 247 306 277 C350 317 394 331 431 296" />
        {uncertain && <path className="protein-art__uncertain" stroke="#f59e0b" strokeWidth="9" strokeDasharray="8 10" d="M454 154 C500 105 548 93 570 61" />}
      </g>
      <g filter="url(#glow)" stroke="#b7ff65" strokeWidth="5" fill="none">
        <path d="M279 204 l30 -22 34 15 2 36 -32 18 -31 -17z" />
        <path d="M309 182 l3 -24 M345 233 l24 13 M282 234 l-22 17" />
      </g>
      <circle cx="312" cy="205" r="5" fill="#efffc6" />
    </svg>
  );
}

export function ChemicalSketch({ variant }: { variant: 1 | 2 | 3 }) {
  const paths: Record<number, ReactNode> = {
    1: <><polygon points="32,70 65,50 98,70 98,108 65,128 32,108"/><polygon points="98,70 131,50 164,70 164,108 131,128 98,108"/><path d="M164 89h42l24-25 28 18-8 35-38 8-20-23"/><text x="15" y="97">Cl</text><text x="123" y="46">N</text><text x="229" y="58">OH</text></>,
    2: <><polygon points="34,75 68,54 102,75 102,114 68,135 34,114"/><polygon points="102,75 136,54 170,75 170,114 136,135 102,114"/><path d="M170 94l30-25 31 16 2 34-32 20-31-25"/><text x="18" y="82">F</text><text x="130" y="50">N</text><text x="222" y="79">O</text></>,
    3: <><polygon points="30,88 64,67 98,88 98,127 64,148 30,127"/><path d="M98 107l43-2 22-35 39 8 11 39-30 25-40-15-2-22"/><polygon points="213,117 245,97 278,117 278,154 245,174 213,154"/><text x="145" y="68">S</text><text x="247" y="92">Cl</text><text x="270" y="164">OH</text></>,
  };
  return <svg className="chemical-sketch" viewBox="0 0 300 190">{paths[variant]}</svg>;
}

export function QrPlaceholder() {
  const qrUrl = `http://${window.location.hostname}:5173/?cellscope=demo`;

  return (
    <div className="qr" aria-label="모바일 연동 QR 코드">
      <QRCodeSVG value={qrUrl} size={170} />
    </div>
  );
}

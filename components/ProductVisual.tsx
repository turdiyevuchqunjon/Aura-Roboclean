import { site } from "@/lib/site";

// Haqiqiy rasm bo'lsa uni ko'rsatadi, aks holda stilize SVG
export default function ProductVisual() {
  if (site.productImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="product-img" src={site.productImage} alt={site.product} />;
  }
  return (
    <svg className="product-svg" viewBox="0 0 400 480" role="img" aria-label="RoboClean Pro">
      <defs>
        <linearGradient id="body" x1="0" x2="1">
          <stop offset="0" stopColor="#0b1d2b" />
          <stop offset=".45" stopColor="#1d3b52" />
          <stop offset=".7" stopColor="#13293a" />
          <stop offset="1" stopColor="#081520" />
        </linearGradient>
        <linearGradient id="top" x1="0" x2="1">
          <stop offset="0" stopColor="#10283a" />
          <stop offset=".5" stopColor="#2a5674" />
          <stop offset="1" stopColor="#0d2231" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5ee6d2" stopOpacity=".55" />
          <stop offset="1" stopColor="#0f8f87" stopOpacity=".85" />
        </linearGradient>
        <linearGradient id="glass" x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".18" />
          <stop offset=".3" stopColor="#ffffff" stopOpacity=".04" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".12" />
        </linearGradient>
        <radialGradient id="shadow">
          <stop offset="0" stopColor="#000" stopOpacity=".55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="452" rx="150" ry="18" fill="url(#shadow)" />
      {/* suv idishi */}
      <path d="M92 318 L308 318 L296 430 Q200 446 104 430 Z" fill="url(#glass)" stroke="#7fe9da" strokeOpacity=".35" />
      <path d="M100 360 Q200 350 300 360 L296 430 Q200 446 104 430 Z" fill="url(#water)" />
      <g fill="#c9fff6" opacity=".8">
        <circle className="bubble b1" cx="150" cy="410" r="5" />
        <circle className="bubble b2" cx="200" cy="420" r="4" />
        <circle className="bubble b3" cx="245" cy="405" r="6" />
        <circle className="bubble b4" cx="180" cy="395" r="3" />
        <circle className="bubble b5" cx="265" cy="425" r="3.5" />
      </g>
      {/* korpus */}
      <path d="M118 120 Q200 96 282 120 L312 318 L88 318 Z" fill="url(#body)" />
      <path d="M118 120 Q200 96 282 120 L286 140 Q200 118 114 140 Z" fill="url(#top)" />
      <ellipse cx="200" cy="112" rx="84" ry="20" fill="#163246" />
      <ellipse cx="200" cy="108" rx="70" ry="13" fill="#0a1a26" />
      {/* tutqich */}
      <path d="M160 104 Q200 60 240 104" fill="none" stroke="#24465f" strokeWidth="14" strokeLinecap="round" />
      {/* panel */}
      <rect x="168" y="150" width="64" height="30" rx="8" fill="#06111a" stroke="#2e6a84" strokeOpacity=".6" />
      <circle cx="186" cy="165" r="4" fill="#5ee6d2" />
      <rect x="196" y="161" width="26" height="8" rx="4" fill="#1b3a50" />
      {/* havo panjarasi */}
      <g stroke="#3b6f8c" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round">
        <line x1="236" y1="214" x2="276" y2="210" />
        <line x1="238" y1="226" x2="279" y2="222" />
        <line x1="240" y1="238" x2="281" y2="234" />
        <line x1="242" y1="250" x2="283" y2="246" />
      </g>
      {/* kirish teshigi */}
      <circle cx="162" cy="246" r="30" fill="#06111a" stroke="#2c5a75" strokeWidth="4" />
      <circle cx="162" cy="246" r="16" fill="#0d2131" />
      {/* yorliq */}
      <text x="200" y="300" textAnchor="middle" fill="#cfe8f3" fontSize="15" fontFamily="var(--font-display)" letterSpacing="2">
        roboclean
      </text>
      {/* yorug'lik */}
      <path d="M140 128 Q132 220 118 312" stroke="#fff" strokeOpacity=".1" strokeWidth="10" fill="none" />
      <path d="M92 318 L308 318" stroke="#5ee6d2" strokeOpacity=".7" strokeWidth="3" />
    </svg>
  );
}

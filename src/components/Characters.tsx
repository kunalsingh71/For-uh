import { useId } from "react";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/*  Two children, two sparklers, one very good evening.               */
/* ------------------------------------------------------------------ */
export function ChildrenScene({ className }: { className?: string }) {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg
      viewBox="0 0 640 480"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
      aria-label="A girl and a boy in festive Indian clothes holding lit sparklers on a Diwali night"
      role="img"
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1038" />
          <stop offset="52%" stopColor="#31174a" />
          <stop offset="100%" stopColor="#4b1e3d" />
        </linearGradient>
        <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d1f33" />
          <stop offset="100%" stopColor="#160c20" />
        </linearGradient>
        <linearGradient id={`${uid}-lehenga`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0493f" />
          <stop offset="55%" stopColor="#b62b3c" />
          <stop offset="100%" stopColor="#6f1230" />
        </linearGradient>
        <linearGradient id={`${uid}-dupatta`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd89a" stopOpacity="0.92" />
          <stop offset="55%" stopColor="#ff9d55" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#e05a4e" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id={`${uid}-kurta`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3dfb4" />
          <stop offset="100%" stopColor="#cfae74" />
        </linearGradient>
        <linearGradient id={`${uid}-jacket`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7d2138" />
          <stop offset="100%" stopColor="#49102a" />
        </linearGradient>
        <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffedc2" />
          <stop offset="50%" stopColor="#e8b564" />
          <stop offset="100%" stopColor="#a9722f" />
        </linearGradient>
        <linearGradient id={`${uid}-skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c98a58" />
          <stop offset="100%" stopColor="#a2643a" />
        </linearGradient>
        <radialGradient id={`${uid}-spark`}>
          <stop offset="0%" stopColor="#fffdf1" />
          <stop offset="30%" stopColor="#ffe1a0" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#ffab45" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff8a2a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-moonGlow`}>
          <stop offset="0%" stopColor="#ffeec9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffeec9" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={`${uid}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      {/* arch of night sky */}
      <path d="M0 480V0h640v480Z" fill={`url(#${uid}-sky)`} />
      <path
        d="M40 480V206C40 108 148 34 320 34s280 74 280 172v274Z"
        fill="rgba(10,6,22,0.35)"
        stroke="rgba(243,201,120,0.28)"
      />
      <path d="M54 480V210C54 118 156 48 320 48s266 70 266 162v270Z" fill="none" stroke="rgba(243,201,120,0.12)" />

      {/* stars */}
      <g fill="#ffeccb">
        {[
          [110, 120, 1.7], [168, 78, 1.2], [205, 148, 1.1], [250, 82, 1.5], [300, 116, 1],
          [360, 76, 1.4], [408, 128, 1.8], [468, 92, 1.2], [512, 154, 1.4], [556, 108, 1],
          [88, 196, 1.2], [590, 208, 1.4], [140, 244, 1], [486, 222, 1.2], [355, 160, 1],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} className="animate-twinkle" style={{ animationDelay: `${i * 0.5}s` }} opacity={0.85} />
        ))}
      </g>

      {/* moon */}
      <circle cx="455" cy="112" r="78" fill={`url(#${uid}-moonGlow)`} />
      <circle cx="455" cy="112" r="38" fill="#f7e6c6" filter={`url(#${uid}-soft)`} opacity="0.9" />
      <circle cx="455" cy="112" r="30" fill={`url(#${uid}-moonGlow)`} />
      <circle cx="455" cy="112" r="30" fill="#f7e6c6" opacity="0.92" />
      <g fill="#d8bf95" opacity="0.35">
        <ellipse cx="448" cy="104" rx="6" ry="5" />
        <ellipse cx="463" cy="119" rx="8" ry="6" />
        <ellipse cx="451" cy="124" rx="4" ry="3" />
      </g>

      {/* bunting / string lights */}
      <path d="M62 88 Q320 178 578 88" fill="none" stroke="rgba(243,201,120,0.4)" strokeWidth="1" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const t = (i + 0.5) / 9;
        const x = 62 + t * 516;
        const y = 88 + Math.sin(t * Math.PI) * 78;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y + 9} stroke="rgba(243,201,120,0.45)" strokeWidth="1" />
            <circle cx={x} cy={y + 13} r="3.4" fill={i % 3 === 0 ? "#ffb45f" : "#ffe6ad"} className="animate-twinkle" style={{ animationDelay: `${i * 0.35}s` }} />
            <circle cx={x} cy={y + 13} r="9" fill="#ffb45f" opacity="0.18" filter={`url(#${uid}-blur)`} />
          </g>
        );
      })}

      {/* skyline */}
      <g fill="#150b24" opacity="0.92">
        <path d="M0 336h640v26H0z" />
        <rect x="14" y="292" width="52" height="48" />
        <rect x="72" y="306" width="34" height="34" />
        <path d="M96 292c0-18 18-32 38-32s38 14 38 32Z" />
        <rect x="134" y="292" width="2" height="16" />
        <rect x="170" y="284" width="60" height="56" />
        <path d="M186 284c0-14 10-24 24-24s24 10 24 24Z" />
        <rect x="246" y="306" width="46" height="34" />
        <rect x="390" y="296" width="56" height="44" />
        <path d="M400 296c0-16 12-28 28-28s28 12 28 28Z" />
        <rect x="460" y="312" width="64" height="28" />
        <rect x="536" y="286" width="48" height="54" />
        <path d="M548 286c0-16 14-30 32-30v30Z" />
        <rect x="594" y="308" width="40" height="32" />
        <rect x="330" y="300" width="2" height="40" />
        <path d="M331 300c-10 0-18-8-18-18 12 0 18 8 18 18Zm0 0c10 0 18-8 18-18-12 0-18 8-18 18Z" />
      </g>
      <g fill="#ffd08a" opacity="0.6">
        {[
          [26, 306], [42, 306], [60, 322], [80, 318], [182, 300], [198, 300], [214, 316],
          [258, 318], [272, 318], [402, 310], [420, 310], [470, 322], [488, 322], [548, 300], [566, 316], [608, 322],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="5" height="6" rx="1" opacity={i % 3 === 0 ? 0.9 : 0.5} />
        ))}
      </g>

      {/* terrace */}
      <rect x="0" y="352" width="640" height="128" fill={`url(#${uid}-floor)`} />
      <path d="M0 352h640" stroke="rgba(243,201,120,0.4)" strokeWidth="1.4" />
      {[390, 424, 456].map((y, i) => (
        <path key={y} d={`M0 ${y} Q320 ${y - 12 + i * 4} 640 ${y}`} stroke="rgba(243,201,120,0.1)" strokeWidth="1" fill="none" />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <path key={i} d={`M${40 + i * 96} 352 L${10 + i * 100} 480`} stroke="rgba(243,201,120,0.07)" strokeWidth="1" />
      ))}

      {/* rangoli at their feet */}
      <g transform="translate(320 470)" opacity="0.85">
        {[54, 78, 104].map((r, i) => (
          <circle key={r} cx="0" cy="0" r={r} fill="none" stroke={i === 1 ? "rgba(255,143,63,0.45)" : "rgba(243,201,120,0.4)"} strokeWidth="1.2" strokeDasharray={i === 1 ? "3 8" : undefined} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <g key={i} transform={`translate(${Math.cos(a) * 66} ${Math.sin(a) * 66})`}>
              <ellipse rx="9" ry="17" fill="rgba(209,80,107,0.35)" />
              <circle r="1.8" fill="#ffd79b" />
            </g>
          );
        })}
      </g>

      {/* diyas on the floor */}
      {[
        [92, 404, 1], [552, 412, 0.9], [474, 392, 0.7],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <ellipse cx="0" cy="4" rx="23" ry="7" fill="#3a1d12" />
          <path d="M-20 0c2 8 9 12 20 12s18-4 20-12c-6 3-13 4-20 4s-14-1-20-4Z" fill="#8d5730" />
          <ellipse cx="0" cy="0" rx="20" ry="5" fill="#b97f42" />
          <g className="flame" style={{ transformOrigin: "0px 0px" }}>
            <ellipse cx="0" cy="-8" rx="10" ry="14" fill="#ffb45f" opacity="0.4" filter={`url(#${uid}-blur)`} />
            <path d="M0-22c5 7 7 11 7 15 0 4-3 7-7 7s-7-3-7-7c0-4 2-8 7-15Z" fill="#ffd48a" />
            <path d="M0-14c2.4 3.5 3.6 6 3.6 8.4 0 2.4-1.6 4-3.6 4s-3.6-1.6-3.6-4c0-2.4 1.2-4.9 3.6-8.4Z" fill="#fff6d6" />
          </g>
        </g>
      ))}

      {/* ---------------- girl ---------------- */}
      <g>
        <ellipse cx="250" cy="410" rx="58" ry="9" fill="rgba(0,0,0,0.35)" />
        {/* braid */}
        <path d="M224 196c-10 22-18 44-12 64 5 16 16 12 22 0" fill="none" stroke="#241018" strokeWidth="12" strokeLinecap="round" />
        <circle cx="213" cy="246" r="5" fill="#e9494f" />
        <circle cx="219" cy="262" r="4" fill="#e9494f" />
        {/* skirt */}
        <path d="M214 286h72l24 118c-40 14-82 14-120 0Z" fill={`url(#${uid}-lehenga)`} />
        <path d="M190 404c40 14 82 14 120 0l4 12c-42 15-86 15-128 0Z" fill={`url(#${uid}-gold)`} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${224 + i * 13} 292 L${200 + i * 22} 400`} stroke="rgba(255,214,154,0.22)" strokeWidth="1.4" />
        ))}
        <g fill="rgba(255,205,130,0.8)">
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={208 + i * 24} cy={380 - Math.abs(i - 2) * 4} r="1.8" />
          ))}
        </g>
        {/* blouse */}
        <path d="M226 254q24-14 48 0l8 40q-32 14-64 0Z" fill="#6f1430" />
        <path d="M226 254q24-14 48 0l2 8q-26-12-52 0Z" fill={`url(#${uid}-gold)`} opacity="0.8" />
        <path d="M224 292q26 10 52 0" stroke="rgba(243,201,120,0.65)" strokeWidth="3" fill="none" />
        {/* dupatta */}
        <path d="M276 256q26 26 18 62-5 24-24 44l-16-12q20-22 22-46 2-24-14-38Z" fill={`url(#${uid}-dupatta)`} opacity="0.85" />
        <path d="M266 250q18 10 24 30" stroke="#ffe0aa" strokeWidth="1.4" fill="none" opacity="0.8" />
        {/* arms */}
        <path d="M274 268q18-5 30-26 9-15 14-26" fill="none" stroke={`url(#${uid}-skin)`} strokeWidth="12" strokeLinecap="round" />
        <path d="M222 272q-14 14-12 32 2 12 10 20" fill="none" stroke="#b16f43" strokeWidth="11" strokeLinecap="round" />
        <g fill="none" stroke="#ffd79b" strokeWidth="2.4">
          <path d="M288 250l3-4M292 256l4-2" />
        </g>
        <circle cx="232" cy="316" r="3" fill="#ffd79b" />
        {/* neck + head */}
        <rect x="240" y="228" width="15" height="20" rx="7" fill="#a2643a" />
        <circle cx="247" cy="204" r="26" fill={`url(#${uid}-skin)`} />
        <path d="M221 202c-4-24 12-38 32-36 18 2 26 16 22 30-8-14-22-18-36-14-8 2-14 10-18 20Z" fill="#241018" />
        <path d="M266 188q12 2 10 18" fill="none" stroke="#241018" strokeWidth="5" strokeLinecap="round" />
        {/* gajra */}
        <g fill="#fff5dc">
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={272 - i * 3} cy={196 + i * 7} r="3.6" />
          ))}
          <circle cx="263" cy="220" r="3" fill="#ffe6ad" />
        </g>
        {/* face */}
        <g>
          <circle cx="237" cy="205" r="2.2" fill="#2a1510" />
          <circle cx="257" cy="205" r="2.2" fill="#2a1510" />
          <path d="M233 199q4-3 8-1M253 198q4-2 8 1" stroke="#2a1510" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M241 214q6 5 12 0" stroke="#5c2b21" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="247" cy="196" r="2.4" fill="#c0273c" />
          <ellipse cx="231" cy="212" rx="4" ry="2.4" fill="#c2564f" opacity="0.4" />
          <ellipse cx="263" cy="212" rx="4" ry="2.4" fill="#c2564f" opacity="0.4" />
        </g>
        <circle cx="220" cy="210" r="3.2" fill={`url(#${uid}-gold)`} />
        <circle cx="274" cy="210" r="3.2" fill={`url(#${uid}-gold)`} />
        <path d="M240 231q7 5 14 0" stroke="#ffd79b" strokeWidth="1.6" fill="none" />
        {/* sparkler */}
        <path d="M312 218L334 148" stroke="#e6c28b" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M312 218L334 148" stroke="#fff3cd" strokeWidth="1.2" strokeLinecap="round" />
        <g transform="translate(335 142)">
          <circle r="34" fill={`url(#${uid}-spark)`} className="animate-glow" />
          <g className="animate-twinkle">
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * 7}
                  y1={Math.sin(a) * 7}
                  x2={Math.cos(a) * (18 + (i % 3) * 6)}
                  y2={Math.sin(a) * (18 + (i % 3) * 6)}
                  stroke="#ffe7b4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              );
            })}
            <circle r="5" fill="#fffdf4" />
          </g>
          {[
            [20, -18], [-22, -10], [15, 20], [-16, 24], [30, 8],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.7} fill="#ffd79b" className="animate-twinkle" style={{ animationDelay: `${i * 0.35}s` }} />
          ))}
        </g>
        <circle cx="316" cy="214" r="5" fill={`url(#${uid}-skin)`} />
        <path d="M309 226q4-4 9-2" stroke="#ffd79b" strokeWidth="1.6" fill="none" />
      </g>

      {/* ---------------- boy ---------------- */}
      <g>
        <ellipse cx="412" cy="410" rx="52" ry="8" fill="rgba(0,0,0,0.35)" />
        {/* dhoti */}
        <path d="M382 322h58l10 76c-26 10-56 10-82 0Z" fill="#efe1c1" />
        <path d="M368 392c28 10 58 10 82 0l3 8c-28 11-60 11-88 0Z" fill="#dcc59a" />
        <path d="M397 330q-2 34-12 60M421 330q2 34 12 60" stroke="rgba(160,128,80,0.4)" strokeWidth="1.4" fill="none" />
        <ellipse cx="379" cy="404" rx="17" ry="6" fill="#7d2138" />
        <ellipse cx="440" cy="404" rx="17" ry="6" fill="#7d2138" />
        {/* kurta */}
        <path d="M380 240q26-14 54 0l10 74q-34 16-74 0Z" fill={`url(#${uid}-kurta)`} />
        <path d="M378 246q-16 14-12 62l14 6 4-58Z" fill={`url(#${uid}-jacket)`} />
        <path d="M436 246q16 14 12 62l-14 6-4-58Z" fill={`url(#${uid}-jacket)`} />
        <path d="M382 248l-8 64M434 248l8 64" stroke="rgba(243,201,120,0.7)" strokeWidth="1.6" fill="none" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="406" cy={264 + i * 22} r="2" fill="#e8b564" />
        ))}
        <path d="M368 306q38 18 76 0" stroke="rgba(122,60,30,0.35)" strokeWidth="2.4" fill="none" />
        {/* arms */}
        <path d="M434 262q22 2 34-18 8-12 10-22" fill="none" stroke={`url(#${uid}-skin)`} strokeWidth="12" strokeLinecap="round" />
        <path d="M382 264q-16 18-10 40" fill="none" stroke="#b16f43" strokeWidth="11" strokeLinecap="round" />
        <circle cx="452" cy="250" r="3" fill="#ffd79b" />
        {/* head */}
        <rect x="400" y="218" width="15" height="20" rx="7" fill="#a2643a" />
        <circle cx="407" cy="196" r="25" fill={`url(#${uid}-skin)`} />
        <path d="M382 194c-4-22 10-36 28-35 17 1 26 12 24 26-9-11-22-15-34-12-8 2-14 10-18 21Z" fill="#241018" />
        <path d="M430 186q8 4 6 16" fill="none" stroke="#241018" strokeWidth="4" strokeLinecap="round" />
        {/* face */}
        <circle cx="398" cy="197" r="2.2" fill="#2a1510" />
        <circle cx="417" cy="197" r="2.2" fill="#2a1510" />
        <path d="M393 191q4-3 8-1M413 190q4-2 8 1" stroke="#2a1510" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M401 207q6 5 12 0" stroke="#5c2b21" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="391" cy="204" rx="3.6" ry="2.2" fill="#c2564f" opacity="0.35" />
        <ellipse cx="423" cy="204" rx="3.6" ry="2.2" fill="#c2564f" opacity="0.35" />
        <path d="M399 222q7 4 14 0" stroke="#ffd79b" strokeWidth="1.6" fill="none" />
        {/* sparkler */}
        <path d="M476 214L496 150" stroke="#e6c28b" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M476 214L496 150" stroke="#fff3cd" strokeWidth="1.2" strokeLinecap="round" />
        <g transform="translate(497 144)">
          <circle r="32" fill={`url(#${uid}-spark)`} className="animate-glow" style={{ animationDelay: "1s" }} />
          <g className="animate-twinkle" style={{ animationDelay: "0.7s" }}>
            {Array.from({ length: 9 }).map((_, i) => {
              const a = (i / 9) * Math.PI * 2 + 0.4;
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * 6}
                  y1={Math.sin(a) * 6}
                  x2={Math.cos(a) * (16 + (i % 4) * 5)}
                  y2={Math.sin(a) * (16 + (i % 4) * 5)}
                  stroke="#ffe7b4"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              );
            })}
            <circle r="4.6" fill="#fffdf4" />
          </g>
          {[
            [-18, 16], [18, -16], [26, 10], [-24, -14],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.6} fill="#ffd79b" className="animate-twinkle" style={{ animationDelay: `${0.4 + i * 0.3}s` }} />
          ))}
        </g>
        <circle cx="479" cy="210" r="5" fill={`url(#${uid}-skin)`} />
      </g>

      {/* foreground glow */}
      <ellipse cx="320" cy="440" rx="260" ry="42" fill="#ffab55" opacity="0.09" filter={`url(#${uid}-blur)`} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  The family: diyas, mithai and one delighted sparkler.             */
/* ------------------------------------------------------------------ */
export function FamilyScene({ className }: { className?: string }) {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg
      viewBox="0 0 720 440"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
      aria-label="An Indian family lighting diyas together on a Diwali evening, with sweets and a sparkler"
      role="img"
    >
      <defs>
        <linearGradient id={`${uid}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26123c" />
          <stop offset="60%" stopColor="#3a1a44" />
          <stop offset="100%" stopColor="#220f2b" />
        </linearGradient>
        <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#48203c" />
          <stop offset="100%" stopColor="#180b20" />
        </linearGradient>
        <linearGradient id={`${uid}-door`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffcf82" />
          <stop offset="55%" stopColor="#e8913f" />
          <stop offset="100%" stopColor="#8a3d1e" />
        </linearGradient>
        <linearGradient id={`${uid}-saree`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c93d49" />
          <stop offset="100%" stopColor="#71152f" />
        </linearGradient>
        <linearGradient id={`${uid}-cream`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e7c8" />
          <stop offset="100%" stopColor="#d8bf95" />
        </linearGradient>
        <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffeec5" />
          <stop offset="100%" stopColor="#c08d3f" />
        </linearGradient>
        <linearGradient id={`${uid}-skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c48756" />
          <stop offset="100%" stopColor="#9a5e36" />
        </linearGradient>
        <radialGradient id={`${uid}-warm`}>
          <stop offset="0%" stopColor="#ffd28b" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffb45f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-spark`}>
          <stop offset="0%" stopColor="#fffdf1" />
          <stop offset="40%" stopColor="#ffe0a0" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffab45" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <rect width="720" height="440" fill={`url(#${uid}-wall)`} />
      {/* jaali arches on the wall */}
      <g stroke="rgba(243,201,120,0.12)" fill="none">
        {[60, 600].map((x) => (
          <g key={x}>
            <path d={`M${x} 300V190c0-34 26-58 58-58s58 24 58 58v110Z`} />
            <path d={`M${x + 14} 300V194c0-24 20-44 44-44s44 20 44 44v106Z`} />
            <path d={`M${x + 30} 300V200c0-16 12-30 28-30s28 14 28 30v100Z`} />
          </g>
        ))}
      </g>

      {/* doorway */}
      <path d="M292 320V182c0-38 30-68 68-68s68 30 68 68v138Z" fill="#1b0d24" stroke="rgba(243,201,120,0.4)" strokeWidth="1.6" />
      <path d="M304 314V186c0-30 24-58 56-58s56 28 56 58v128Z" fill={`url(#${uid}-door)`} opacity="0.32" />
      <path d="M304 314V186c0-30 24-58 56-58s56 28 56 58v128Z" fill="none" stroke="rgba(255,214,150,0.35)" />
      <rect x="358" y="150" width="2" height="164" fill="rgba(90,45,25,0.5)" />
      <ellipse cx="360" cy="300" rx="120" ry="46" fill={`url(#${uid}-warm)`} />
      {/* marigold toran over the door */}
      <g>
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 300 + i * 15;
          return (
            <g key={i} transform={`translate(${x} ${108 + Math.sin(i * 0.9) * 6 + (i === 4 ? 12 : 0)})`}>
              <circle r="5.5" fill={i % 2 === 0 ? "#ff9a3d" : "#ffb454"} />
              <circle r="2" fill="#ffe2a5" />
            </g>
          );
        })}
        <path d="M298 106c42-26 84-26 126 0" fill="none" stroke="rgba(243,201,120,0.4)" />
      </g>

      {/* string lights */}
      <path d="M0 70Q200 140 360 74T720 70" fill="none" stroke="rgba(243,201,120,0.32)" strokeWidth="1" />
      {Array.from({ length: 13 }).map((_, i) => {
        const t = i / 12;
        const x = t * 720;
        const y = 70 + Math.sin(t * Math.PI * 2) * 22 + 10;
        return (
          <g key={i}>
            <circle cx={x} cy={y + 8} r="2.8" fill={i % 3 === 0 ? "#ffb45f" : "#ffe6ad"} className="animate-twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
            <circle cx={x} cy={y + 8} r="8" fill="#ffb45f" opacity="0.16" filter={`url(#${uid}-blur)`} />
          </g>
        );
      })}

      {/* floor */}
      <rect y="320" width="720" height="120" fill={`url(#${uid}-floor)`} />
      <path d="M0 320h720" stroke="rgba(243,201,120,0.35)" />
      {[352, 386].map((y) => (
        <path key={y} d={`M0 ${y}Q360 ${y - 10} 720 ${y}`} fill="none" stroke="rgba(243,201,120,0.08)" />
      ))}

      {/* rangoli */}
      <g transform="translate(360 424)">
        {[50, 76, 104, 132].map((r, i) => (
          <circle key={r} r={r} fill="none" stroke={i % 2 === 0 ? "rgba(243,201,120,0.4)" : "rgba(255,143,63,0.35)"} strokeWidth={i === 0 ? 1.8 : 1.2} strokeDasharray={i === 2 ? "2 8" : undefined} />
        ))}
        {Array.from({ length: 16 }).map((_, i) => {
          return (
            <g key={i} transform={`rotate(${(i / 16) * 360})`}>
              <ellipse cx="0" cy="-70" rx="9" ry="18" fill={i % 2 ? "rgba(209,80,107,0.3)" : "rgba(255,166,80,0.32)"} />
              <circle cx="0" cy="-118" r="1.8" fill="#ffd79b" />
            </g>
          );
        })}
      </g>

      {/* mother (seen from behind, kneeling) */}
      <g>
        <ellipse cx="228" cy="372" rx="74" ry="18" fill="rgba(0,0,0,0.32)" />
        <path d="M150 372c6-58 36-92 78-94 42 2 74 36 80 94Z" fill={`url(#${uid}-saree)`} />
        <path d="M162 356c40 18 92 18 134 0l4 16c-46 20-98 20-142 0Z" fill="rgba(255,208,138,0.2)" />
        <path d="M176 300c30 26 74 26 104 0" stroke="rgba(255,214,154,0.4)" strokeWidth="2" fill="none" />
        <path d="M226 208c-28 2-46 26-44 58 2 30 18 54 44 58 26-4 42-28 44-58 2-32-16-56-44-58Z" fill={`url(#${uid}-saree)`} />
        <path d="M228 214c22 4 34 28 32 56-2 26-14 46-32 50-18-4-30-24-32-50-2-28 10-52 32-56Z" fill="#d94d54" opacity="0.35" />
        {/* head */}
        <circle cx="228" cy="204" r="27" fill={`url(#${uid}-skin)`} />
        <path d="M202 210c-6-26 8-44 30-44 20 0 32 14 28 34-8-12-20-18-32-16-10 2-20 12-26 26Z" fill="#241018" />
        <path d="M250 184c16-4 26 6 24 22 0 10-8 18-18 18" fill="#241018" />
        <circle cx="276" cy="206" r="14" fill="#241018" />
        <circle cx="222" cy="222" r="2" fill="#c0273c" />
        <g fill="#fff5dc">
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={282 - (i % 2) * 5} cy={196 + i * 8} r="3.2" />
          ))}
        </g>
        <path d="M218 200q4-2 8 0M238 200q4-2 8 0" stroke="#2a1510" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <circle cx="222" cy="206" r="2" fill="#2a1510" />
        <circle cx="242" cy="206" r="2" fill="#2a1510" />
        <path d="M226 214q5 4 10 0" stroke="#5c2b21" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="208" cy="210" r="3" fill={`url(#${uid}-gold)`} />
        <circle cx="250" cy="210" r="3" fill={`url(#${uid}-gold)`} />
        {/* arm reaching to diya */}
        <path d="M256 268q26 12 30 34 3 18-6 24" fill="none" stroke={`url(#${uid}-skin)`} strokeWidth="12" strokeLinecap="round" />
        <circle cx="282" cy="326" r="6" fill={`url(#${uid}-skin)`} />
        <g fill="#ffe8b5">
          <circle cx="276" cy="318" r="2" />
          <circle cx="286" cy="320" r="2" />
          <circle cx="281" cy="312" r="1.6" />
        </g>
        {/* her own diya, waiting to be lit */}
        <g transform="translate(288 358) scale(0.62)">
          <ellipse cx="0" cy="4" rx="22" ry="6" fill="#3a1d12" />
          <path d="M-19 0c2 8 9 12 19 12s17-4 19-12c-6 3-12 4-19 4s-13-1-19-4Z" fill="#8d5730" />
          <ellipse cx="0" cy="0" rx="19" ry="5" fill="#b97f42" />
          <g className="flame" style={{ animationDelay: "0.6s" }}>
            <ellipse cx="0" cy="-9" rx="11" ry="15" fill="#ffb45f" opacity="0.45" filter={`url(#${uid}-blur)`} />
            <path d="M0-22c5 7 7 11 7 15 0 4-3 7-7 7s-7-3-7-7c0-4 2-8 7-15Z" fill="#ffd48a" />
            <path d="M0-14c2.4 3.5 3.6 6 3.6 8.4 0 2.4-1.6 4-3.6 4s-3.6-1.6-3.6-4c0-2.4 1.2-4.9 3.6-8.4Z" fill="#fff6d6" />
          </g>
        </g>
      </g>

      {/* father (kneeling, side) */}
      <g>
        <ellipse cx="500" cy="376" rx="66" ry="16" fill="rgba(0,0,0,0.32)" />
        <path d="M446 376c-2-38 20-64 50-66 32-2 56 24 60 66Z" fill="#f0e0bd" />
        <path d="M446 362c32 14 74 14 108 0l2 16c-36 16-80 16-114 0Z" fill="#e3cfa4" />
        <path d="M456 318q36 18 76 0l-6 26q-32 14-64 0Z" fill={`url(#${uid}-gold)`} opacity="0.5" />
        <path d="M462 240q30-16 58 0l10 84q-38 16-78 0Z" fill={`url(#${uid}-cream)`} />
        <path d="M460 246l-10 80 12 4 8-78Z" fill="#8f2b3c" opacity="0.85" />
        <path d="M522 246l10 80-12 4-8-78Z" fill="#8f2b3c" opacity="0.85" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="492" cy={262 + i * 20} r="1.8" fill="#c79a52" />
        ))}
        <path d="M454 328q38 14 76 0" stroke="rgba(140,90,45,0.35)" strokeWidth="2" fill="none" />
        <rect x="483" y="218" width="14" height="20" rx="7" fill="#9a5e36" />
        <circle cx="490" cy="200" r="25" fill={`url(#${uid}-skin)`} />
        <path d="M466 198c-4-22 10-36 28-35 16 1 25 12 23 26-9-11-21-15-33-12-8 2-14 10-18 21Z" fill="#241018" />
        <path d="M512 190q8 6 5 18" fill="none" stroke="#241018" strokeWidth="4" strokeLinecap="round" />
        <circle cx="481" cy="201" r="2" fill="#2a1510" />
        <circle cx="500" cy="201" r="2" fill="#2a1510" />
        <path d="M476 196q4-2 8 0M496 195q4-2 8 0" stroke="#2a1510" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M484 210q6 4 12 0" stroke="#5c2b21" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M482 226q8 4 15 0" stroke="#ffd79b" strokeWidth="1.4" fill="none" />
        {/* arm with diya */}
        <path d="M462 264q-24 12-30 32-4 16 6 22" fill="none" stroke={`url(#${uid}-skin)`} strokeWidth="12" strokeLinecap="round" />
        <g transform="translate(438 330) scale(0.7)">
          <ellipse cx="0" cy="4" rx="22" ry="7" fill="#3a1d12" />
          <path d="M-19 0c2 8 9 12 19 12s17-4 19-12c-6 3-12 4-19 4s-13-1-19-4Z" fill="#8d5730" />
          <ellipse cx="0" cy="0" rx="19" ry="5" fill="#b97f42" />
          <g className="flame">
            <ellipse cx="0" cy="-8" rx="12" ry="16" fill="#ffb45f" opacity="0.45" filter={`url(#${uid}-blur)`} />
            <path d="M0-24c5 7 8 12 8 16 0 4-4 7-8 7s-8-3-8-7c0-4 3-9 8-16Z" fill="#ffd48a" />
            <path d="M0-15c2.4 4 3.6 6.4 3.6 8.8 0 2.4-1.6 4-3.6 4s-3.6-1.6-3.6-4c0-2.4 1.2-4.8 3.6-8.8Z" fill="#fff6d6" />
          </g>
        </g>
      </g>

      {/* daughter with a plate of mithai */}
      <g>
        <ellipse cx="614" cy="394" rx="38" ry="8" fill="rgba(0,0,0,0.3)" />
        <path d="M592 300h50l14 92c-26 10-54 10-78 0Z" fill="#e2494f" />
        <path d="M580 386c24 10 54 10 76 0l3 8c-26 11-58 11-82 0Z" fill={`url(#${uid}-gold)`} />
        <path d="M596 306q24 22 44 0l-4-20q-18 12-36 0Z" fill="#f6c96e" opacity="0.85" />
        <path d="M588 250q28-12 52 0l8 44q-34 14-68 0Z" fill="#ffe3a8" />
        <path d="M584 286q36 16 66 0" stroke="rgba(190,130,60,0.5)" strokeWidth="2" fill="none" />
        <path d="M636 266q20 10 22 32" fill="none" stroke={`url(#${uid}-skin)`} strokeWidth="10" strokeLinecap="round" />
        <path d="M588 268q-18 12-14 32" fill="none" stroke="#b16f43" strokeWidth="10" strokeLinecap="round" />
        <rect x="606" y="230" width="12" height="16" rx="6" fill="#9a5e36" />
        <circle cx="612" cy="216" r="21" fill={`url(#${uid}-skin)`} />
        <path d="M592 216c-2-20 10-32 24-31 12 1 19 10 17 22-7-9-16-12-25-10-7 2-12 8-16 19Z" fill="#241018" />
        <path d="M624 202c10-2 16 4 15 14-1 8-6 14-13 14" fill="#241018" />
        <circle cx="583" cy="222" r="6" fill="#241018" />
        <circle cx="600" cy="214" r="1.8" fill="#2a1510" />
        <circle cx="615" cy="214" r="1.8" fill="#2a1510" />
        <path d="M598 226q6 4 11 0" stroke="#5c2b21" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="607" cy="210" r="1.8" fill="#c0273c" />
        <circle cx="586" cy="218" r="2.4" fill={`url(#${uid}-gold)`} />
        <circle cx="624" cy="200" r="2.4" fill="#fff5dc" />
        {/* mithai thali */}
        <g transform="translate(654 322) scale(0.9)">
          <ellipse cx="0" cy="10" rx="26" ry="7" fill="#8a5a2a" />
          <ellipse cx="0" cy="6" rx="26" ry="8" fill={`url(#${uid}-gold)`} />
          <ellipse cx="0" cy="4" rx="21" ry="6" fill="#a8742f" />
          {[
            [-10, 0], [2, -2], [11, 1], [-4, -6],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y - 2} r="5" fill={i % 2 === 0 ? "#f7c96d" : "#e39a52"} />
              <circle cx={x} cy={y - 4} r="1.6" fill="#fff3d1" />
            </g>
          ))}
          <path d="M-26 6c6-14 46-14 52 0" fill="none" stroke="rgba(255,230,170,0.5)" />
        </g>
      </g>

      {/* son with a sparkler */}
      <g>
        <ellipse cx="326" cy="400" rx="34" ry="7" fill="rgba(0,0,0,0.3)" />
        <path d="M306 338h42l10 56c-22 8-44 8-62 0Z" fill="#3f6d8d" />
        <path d="M300 280q26-12 48 0l6 62q-30 12-60 0Z" fill="#f4ddae" />
        <path d="M298 284l-4 52 10 4 4-52Z" fill="#b93a3f" opacity="0.8" />
        <path d="M350 284l4 52-10 4-4-52Z" fill="#b93a3f" opacity="0.8" />
        <path d="M352 296q18 6 22 20" fill="none" stroke={`url(#${uid}-skin)`} strokeWidth="9" strokeLinecap="round" />
        <path d="M300 290q-18 8-18 22" fill="none" stroke={`url(#${uid}-skin)`} strokeWidth="9" strokeLinecap="round" />
        <rect x="317" y="262" width="10" height="14" rx="5" fill="#9a5e36" />
        <circle cx="322" cy="250" r="19" fill={`url(#${uid}-skin)`} />
        <path d="M304 250c-2-18 9-29 22-28 11 1 17 9 15 20-6-8-14-11-22-9-6 2-11 7-15 17Z" fill="#241018" />
        <circle cx="334" cy="236" r="5" fill="#241018" />
        <circle cx="315" cy="250" r="1.7" fill="#2a1510" />
        <circle cx="329" cy="250" r="1.7" fill="#2a1510" />
        <path d="M313 258q6 5 12 0" stroke="#5c2b21" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M372 314L396 272" stroke="#e6c28b" strokeWidth="3" strokeLinecap="round" />
        <g transform="translate(398 266)">
          <circle r="26" fill={`url(#${uid}-spark)`} className="animate-glow" />
          <g className="animate-twinkle">
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * 5}
                  y1={Math.sin(a) * 5}
                  x2={Math.cos(a) * (13 + (i % 3) * 5)}
                  y2={Math.sin(a) * (13 + (i % 3) * 5)}
                  stroke="#ffe7b4"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              );
            })}
            <circle r="4" fill="#fffdf4" />
          </g>
        </g>
        <circle cx="312" cy="382" r="6" fill="#7d2138" />
        <circle cx="340" cy="382" r="6" fill="#7d2138" />
      </g>

      {/* diyas lined up in front */}
      {[
        [176, 402, 0.62], [214, 414, 0.55], [470, 408, 0.58], [522, 416, 0.5], [660, 404, 0.45],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <ellipse cx="0" cy="4" rx="22" ry="6" fill="#3a1d12" />
          <path d="M-19 0c2 8 9 12 19 12s17-4 19-12c-6 3-12 4-19 4s-13-1-19-4Z" fill="#8d5730" />
          <ellipse cx="0" cy="0" rx="19" ry="5" fill="#b97f42" />
          <g className="flame" style={{ animationDelay: `${i * 0.4}s` }}>
            <ellipse cx="0" cy="-9" rx="11" ry="15" fill="#ffb45f" opacity="0.45" filter={`url(#${uid}-blur)`} />
            <path d="M0-22c5 7 7 11 7 15 0 4-3 7-7 7s-7-3-7-7c0-4 2-8 7-15Z" fill="#ffd48a" />
            <path d="M0-14c2.4 3.5 3.6 6 3.6 8.4 0 2.4-1.6 4-3.6 4s-3.6-1.6-3.6-4c0-2.4 1.2-4.9 3.6-8.4Z" fill="#fff6d6" />
          </g>
        </g>
      ))}

      {/* gifts */}
      <g transform="translate(86 388)">
        <rect x="0" y="10" width="42" height="30" rx="3" fill="#8f2b3c" />
        <rect x="0" y="10" width="42" height="7" fill={`url(#${uid}-gold)`} />
        <path d="M21 10v30" stroke={`url(#${uid}-gold)`} strokeWidth="3" />
        <path d="M21 10c-8-2-12-8-9-11 3-2 8 3 9 11Zm0 0c8-2 12-8 9-11-3-2-8 3-9 11Z" fill="#ffd79b" />
      </g>
      <g transform="translate(126 408) rotate(-6)">
        <rect x="0" y="10" width="34" height="24" rx="3" fill="#3d6b7d" />
        <rect x="0" y="10" width="34" height="6" fill="#ffd79b" />
        <path d="M17 10v24" stroke="#ffd79b" strokeWidth="2.4" />
        <path d="M17 10c-7-2-10-7-7-9 3-2 6 2 7 9Zm0 0c7-2 10-7 7-9-3-2-6 2-7 9Z" fill="#ffe6ae" />
      </g>

      <ellipse cx="360" cy="412" rx="250" ry="36" fill="#ffab55" opacity="0.1" filter={`url(#${uid}-blur)`} />
    </svg>
  );
}

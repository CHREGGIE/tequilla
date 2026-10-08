import { useId } from "react";
import { formatTequilaType } from "@/lib/utils";

// Illustrated stand-in for bottles without a photo. Liquid colour follows the
// tequila type; the silhouette is picked from the slug so a grid of
// placeholders doesn't look like one bottle repeated.

const SILHOUETTES = [
  // Classic: rounded shoulders
  {
    body: "M52 30H68V68C68 80 98 84 98 100V220Q98 230 88 230H32Q22 230 22 220V100C22 84 52 80 52 68Z",
    cork: { x: 50, y: 8, width: 20, height: 24, rx: 3 },
    labelY: 150,
  },
  // Angular: straight sloped shoulders
  {
    body: "M54 34H66V74L94 92V222Q94 230 86 230H34Q26 230 26 222V92L54 74Z",
    cork: { x: 51, y: 10, width: 18, height: 26, rx: 2 },
    labelY: 148,
  },
  // Decanter: wide and squat with a big stopper
  {
    body: "M50 44H70V96C100 104 104 130 104 160V220Q104 230 94 230H26Q16 230 16 220V160C16 130 20 104 50 96Z",
    cork: { x: 44, y: 14, width: 32, height: 32, rx: 14 },
    labelY: 166,
  },
];

const LIQUID_LEVEL = 112;

function pickSilhouette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return SILHOUETTES[Math.abs(hash) % SILHOUETTES.length];
}

interface BottlePlaceholderProps {
  name: string;
  type: string;
  seed: string;
  noma?: string | null;
}

export function BottlePlaceholder({ name, type, seed, noma }: BottlePlaceholderProps) {
  const id = useId();
  const clipId = `${id}-body`;
  const shape = pickSilhouette(seed);
  const typeLabel = formatTequilaType(type).toUpperCase();

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-card to-background">
      <svg
        viewBox="0 0 120 240"
        role="img"
        aria-label={`${name} — no photo yet`}
        className="h-4/5 w-auto"
      >
        <defs>
          <clipPath id={clipId}>
            <path d={shape.body} />
          </clipPath>
        </defs>

        <rect {...shape.cork} style={{ fill: "var(--bottle-cork)" }} />

        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="120" height="240" style={{ fill: "var(--bottle-glass)" }} />
          <rect
            x="0"
            y={LIQUID_LEVEL}
            width="120"
            height={240 - LIQUID_LEVEL}
            style={{ fill: `var(--liquid-${type}, var(--liquid-blanco))` }}
          />
          <rect
            x="0"
            y={LIQUID_LEVEL}
            width="120"
            height="2"
            style={{ fill: "var(--bottle-highlight)" }}
          />
          <rect x="30" y="96" width="4" height="120" rx="2" style={{ fill: "var(--bottle-highlight)" }} />
        </g>

        <path
          d={shape.body}
          style={{ fill: "none", stroke: "var(--bottle-outline)", strokeWidth: 1.5 }}
        />

        <rect
          x="32"
          y={shape.labelY}
          width="56"
          height={noma ? 40 : 30}
          rx="2"
          style={{ fill: "var(--card)", stroke: "var(--bottle-outline)", strokeWidth: 0.75 }}
        />
        <text
          x="60"
          y={shape.labelY + 18}
          textAnchor="middle"
          style={{
            fill: "var(--foreground)",
            fontSize: typeLabel.length > 9 ? 5.5 : 7,
            letterSpacing: 1,
            fontWeight: 600,
          }}
        >
          {typeLabel}
        </text>
        {noma && (
          <text
            x="60"
            y={shape.labelY + 30}
            textAnchor="middle"
            style={{ fill: "var(--muted)", fontSize: 6, letterSpacing: 0.5 }}
          >
            NOM {noma}
          </text>
        )}
      </svg>
    </div>
  );
}

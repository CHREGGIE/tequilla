import type { SVGProps } from "react";

// Tequillist icon set: 24px grid, 1.5 stroke, round caps, currentColor.
// Keep additions in this file and in the same drawing style.

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Icon({ title, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

// 9 leaves fanned from a common base: center, then pairs at ±18°, ±36°, ±54°, ±72°.
const AGAVE_LEAVES: [angle: number, length: number][] = [
  [0, 17],
  [-18, 15.5],
  [18, 15.5],
  [-36, 13],
  [36, 13],
  [-54, 10],
  [54, 10],
  [-72, 7],
  [72, 7],
];

function leafPath(length: number) {
  const w = Math.min(1.9, length * 0.13);
  return `M12 21C${12 - w} ${21 - length * 0.3} ${12 - w * 0.7} ${21 - length * 0.65} 12 ${21 - length}C${12 + w * 0.7} ${21 - length * 0.65} ${12 + w} ${21 - length * 0.3} 12 21Z`;
}

/** The brand mark. Filled, unlike the stroke icons. */
export function AgaveMark({ title, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title && <title>{title}</title>}
      {AGAVE_LEAVES.map(([angle, length]) => (
        <path key={angle} d={leafPath(length)} transform={`rotate(${angle} 12 21)`} />
      ))}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Icon>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const HeartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z" />
  </Icon>
);

export const BookmarkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 3.5h10v17l-5-3.5-5 3.5Z" />
  </Icon>
);

/** Additive-free: a single drop with a check — nothing added. */
export const PureDropIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5Z" />
    <path d="m9.3 14 1.9 1.9 3.6-3.8" />
  </Icon>
);

export const LeafIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19.5 4.5C11 4.5 5 9 5 15.5c0 1.4.3 2.6.8 3.7 7.3.3 13.7-4.4 13.7-14.7Z" />
    <path d="M4.5 20.5c3-4.5 6.5-7.5 10.5-9.5" />
  </Icon>
);

export const BarrelIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 3.5h10c1.3 2.7 2 5.5 2 8.5s-.7 5.8-2 8.5H7C5.7 17.8 5 15 5 12s.7-5.8 2-8.5Z" />
    <path d="M5.6 8h12.8M5.6 16h12.8" />
  </Icon>
);

export const BookIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 6.5C10 5 7.5 4.5 4 4.5v14c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2v-14c-3.5 0-6 .5-8 2Z" />
    <path d="M12 6.5v14" />
  </Icon>
);

export const CocktailIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 4.5h15L12 13Z" />
    <path d="M12 13v7M8 20.5h8" />
    <circle cx="17.5" cy="4" r="2" />
  </Icon>
);

export const MapPinIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 0 0-13 0c0 5 6.5 11 6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Icon>
);

export const BottleIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 2.5h4v4.2c2.2 1 3.5 2.8 3.5 5.3v8.5h-11V12c0-2.5 1.3-4.3 3.5-5.3Z" />
    <path d="M6.5 13.5h11" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

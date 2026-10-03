import { polyPath } from "@/lib/geometry";

// شبكة نجوم ثمانية (خاتم سليمان) — بتتكرر وتغطي أي سطح
const CENTERS = [
  [40, 40],
  [0, 0],
  [80, 0],
  [0, 80],
  [80, 80],
];
const DIAMONDS = [
  [20, 20],
  [60, 20],
  [20, 60],
  [60, 60],
];

export default function IslamicPattern({ uid, className = "pattern" }) {
  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id={uid} width="80" height="80" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.8">
            {CENTERS.map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <path d={polyPath(x, y, 26, 4, 0)} />
                <path d={polyPath(x, y, 26, 4, 45)} />
                <circle cx={x} cy={y} r="3" />
              </g>
            ))}
            {DIAMONDS.map(([x, y]) => (
              <path key={`d-${x}-${y}`} d={polyPath(x, y, 5, 4, 0)} />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid})`} />
    </svg>
  );
}

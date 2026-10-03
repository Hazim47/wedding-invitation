import { leafPath, polar } from "@/lib/geometry";

// إكليل أغصان زيتون ذهبي: غصنين يلتقوا من تحت ويفتحوا من فوق
const R = 150;

function Branch({ side }) {
  const right = side === "right";
  const from = right ? 172 : 188;
  const to = right ? 38 : 322;
  const step = right ? -9 : 9;
  const count = Math.floor(Math.abs(to - from) / 9) + 1;

  const [sx, sy] = polar(0, 0, R, from);
  const [ex, ey] = polar(0, 0, R, to);
  const stem = `M${sx.toFixed(2)} ${sy.toFixed(2)} A${R} ${R} 0 0 ${right ? 0 : 1} ${ex.toFixed(2)} ${ey.toFixed(2)}`;

  const items = [];
  for (let i = 0; i < count; i++) {
    const a = from + step * i;
    const k = 1 - (i / count) * 0.45; // الأوراق بتصغر ناحية الطرف
    const [x, y] = polar(0, 0, R, a);
    const heading = right ? a - 90 : a + 90;
    items.push({ x, y, heading, k, i });
  }

  return (
    <g>
      <path d={stem} />
      {items.map(({ x, y, heading, k, i }) => (
        <g key={i}>
          <path
            d={leafPath(34 * k, 9 * k)}
            transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(heading + 38).toFixed(1)})`}
          />
          <path
            d={leafPath(30 * k, 8 * k)}
            transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(heading - 38).toFixed(1)})`}
          />
          {i % 3 === 1 && (
            <circle
              cx={x.toFixed(2)}
              cy={y.toFixed(2)}
              r={2.2 * k}
              fill="currentColor"
              stroke="none"
            />
          )}
        </g>
      ))}
    </g>
  );
}

export default function Wreath() {
  return (
    <svg
      viewBox="-200 -200 400 400"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      >
        <circle r="118" strokeDasharray="1 6" opacity="0.6" />
        <Branch side="right" />
        <Branch side="left" />
      </g>
    </svg>
  );
}

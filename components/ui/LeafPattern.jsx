import { leafPath } from "@/lib/geometry";

// نقش أوراق ناعم بيتكرر ويغطي أي سطح (بدل النقش الهندسي)
export default function LeafPattern({ uid, className = "pattern" }) {
  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id={uid} width="64" height="64" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.7">
            <path
              d={leafPath(18, 5)}
              transform="translate(16 30) rotate(-35)"
            />
            <path d={leafPath(18, 5)} transform="translate(16 30) rotate(35)" />
            <path
              d={leafPath(14, 4)}
              transform="translate(48 62) rotate(-35)"
            />
            <path d={leafPath(14, 4)} transform="translate(48 62) rotate(35)" />
            <circle cx="48" cy="18" r="1.4" fill="currentColor" stroke="none" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid})`} />
    </svg>
  );
}

"use client";

export default function Mandala() {
  return (
    <svg
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <g id="petal">
          <path
            d="
              M 400 105
              C 425 145 425 185 400 215
              C 375 185 375 145 400 105
              Z
            "
          />
        </g>

        <g id="small-petal">
          <path
            d="
              M 400 55
              C 414 78 414 100 400 118
              C 386 100 386 78 400 55
              Z
            "
          />
        </g>
      </defs>

      {/* الدائرة الخارجية */}
      <circle
        cx="400"
        cy="400"
        r="320"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      <circle
        cx="400"
        cy="400"
        r="305"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeDasharray="2 8"
      />

      {/* البتلات الكبيرة */}
      <g fill="none" stroke="currentColor" strokeWidth="1">
        {Array.from({ length: 12 }).map((_, i) => (
          <use
            key={`large-${i}`}
            href="#petal"
            transform={`rotate(${i * 30} 400 400)`}
          />
        ))}
      </g>

      {/* البتلات الصغيرة */}
      <g fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.8">
        {Array.from({ length: 24 }).map((_, i) => (
          <use
            key={`small-${i}`}
            href="#small-petal"
            transform={`rotate(${i * 15} 400 400)`}
          />
        ))}
      </g>

      {/* الدائرة الداخلية */}
      <circle
        cx="400"
        cy="400"
        r="190"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      <circle
        cx="400"
        cy="400"
        r="150"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="1 7"
      />

      {/* مركز الماندالا */}
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        <circle cx="400" cy="400" r="70" />

        <circle cx="400" cy="400" r="52" />

        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`line-${i}`}
            x1="400"
            y1="348"
            x2="400"
            y2="452"
            transform={`rotate(${i * 22.5} 400 400)`}
          />
        ))}
      </g>
    </svg>
  );
}

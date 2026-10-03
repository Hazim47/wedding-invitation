"use client";

import { useId } from "react";

// عصفور ذهبي ينظر لليسار. الجناحان يرفرفان بـ CSS (انظر .bird-wing في globals.css)
const WING =
  "M86 66 C90 42 110 20 158 6 C152 14 150 18 152 20 C146 24 142 28 144 32 C136 36 132 42 134 46 C124 52 118 60 112 72 Z";
const BODY =
  "M52 52 C70 46 100 56 128 74 C146 86 162 96 176 104 C160 106 146 104 132 100 C116 106 90 104 70 94 C54 86 46 72 52 52 Z";

export default function Bird({ flying = false, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const body = `bb${uid}`;
  const wing = `bw${uid}`;

  return (
    <svg
      className={`bird${flying ? " is-flying" : ""} ${className}`}
      viewBox="0 0 190 124"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8e7ae" />
          <stop offset="0.5" stopColor="#d9b358" />
          <stop offset="1" stopColor="#a97c32" />
        </linearGradient>
        <linearGradient id={wing} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f3dc97" />
          <stop offset="1" stopColor="#c9a24d" />
        </linearGradient>
      </defs>

      <path
        className="bird-wing bird-wing--back"
        d={WING}
        fill={`url(#${wing})`}
        stroke="#a97c32"
        strokeWidth="0.8"
        opacity="0.6"
      />

      <g
        className="bird-feet"
        stroke="#a97c32"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M90 100 L90 118 M100 100 L100 118" />
      </g>

      <path
        d={BODY}
        fill={`url(#${body})`}
        stroke="#a97c32"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <circle
        cx="46"
        cy="58"
        r="10.5"
        fill={`url(#${body})`}
        stroke="#a97c32"
        strokeWidth="0.9"
      />
      <path d="M36 56 L23 61 L36 65Z" fill="#8a6420" />
      <circle cx="42" cy="56" r="1.8" fill="#5b3f10" />
      <path
        d="M146 90 L170 99 M140 96 L162 108 M134 99 L152 110"
        stroke="#a97c32"
        strokeWidth="0.8"
        fill="none"
        opacity="0.7"
        strokeLinecap="round"
      />

      <path
        className="bird-wing"
        d={WING}
        fill={`url(#${wing})`}
        stroke="#a97c32"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

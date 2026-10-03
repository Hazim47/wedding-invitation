"use client";

import Reveal from "../ui/Reveal";
import Ornament from "../ui/Ornament";
import { wedding } from "@/lib/wedding";

export default function Footer() {
  const { couple, date, venue } = wedding;
  const [a, b] = couple.initials;

  return (
    <footer className="sec footer">
      <Reveal y={60} amount={0.15}>
        <Ornament />
        <p className="footer-small">وكانت أجمل حكاية...</p>

        <div className="mono">
          <svg viewBox="-60 -60 120 120" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="0.8">
              <circle r="57" />
              <circle r="50" opacity="0.5" />
              <g className="ring-slow">
                <circle r="43" strokeDasharray="1 5" opacity="0.8" />
              </g>
            </g>
          </svg>
          <div className="mono-text">
            <span>{a}</span>
            <i>&amp;</i>
            <span>{b}</span>
          </div>
        </div>

        <div className="footer-names">
          <span className="gold-text">{couple.bride}</span>
          <i />
          <span className="gold-text">{couple.groom}</span>
        </div>

        <div className="footer-date">
          {date.day} <span>•</span> {date.month} <span>•</span> {date.year}
        </div>

        <p className="footer-message">بوجودكم تكتمل فرحتنا</p>
        <p className="footer-location">
          {venue.name} — {venue.city.split(" — ")[0]}
        </p>

        <div className="footer-bottom">
          <span>بكل الحب</span>
          <i aria-hidden="true">♡</i>
          <span>
            {couple.bride} &amp; {couple.groom}
          </span>
        </div>
      </Reveal>
    </footer>
  );
}

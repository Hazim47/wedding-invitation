"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "../ui/Reveal";
import Ornament from "../ui/Ornament";
import { wedding } from "@/lib/wedding";

const EASE = [0.22, 1, 0.36, 1];
const CIRC = 2 * Math.PI * 46;
const pad = (n) => String(n).padStart(2, "0");

// null في أول رندر (السيرفر) عشان ما يصير hydration mismatch
function useNow() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function toICSDate(d) {
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function downloadICS() {
  const start = new Date(wedding.date.iso);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const { bride, groom } = wedding.couple;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//AR",
    "BEGIN:VEVENT",
    `UID:${toICSDate(start)}-wedding@invitation`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:حفل زفاف ${bride} & ${groom}`,
    `LOCATION:${wedding.venue.name} — ${wedding.venue.city}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wedding.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Unit({ value, label, progress }) {
  return (
    <div className="cd-unit">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="cd-ring-bg" cx="50" cy="50" r="46" />
        <motion.circle
          className="cd-ring"
          cx="50"
          cy="50"
          r="46"
          style={{ strokeDasharray: CIRC }}
          initial={false}
          animate={{ strokeDashoffset: CIRC * (1 - progress) }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>

      <div className="cd-inner">
        <div className="cd-num">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              initial={{ y: "60%", opacity: 0, rotateX: -60 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: "-60%", opacity: 0, rotateX: 60 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {pad(value)}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="cd-label">{label}</span>
      </div>
    </div>
  );
}

export default function Countdown() {
  const now = useNow();
  const target = new Date(wedding.date.iso).getTime();
  const diff = now == null ? null : target - now;
  const past = diff != null && diff <= 0;
  const live = diff != null && diff > 0;

  const days = live ? Math.floor(diff / 864e5) : 0;
  const hours = live ? Math.floor(diff / 36e5) % 24 : 0;
  const minutes = live ? Math.floor(diff / 6e4) % 60 : 0;
  const seconds = live ? Math.floor(diff / 1e3) % 60 : 0;

  const units = [
    { label: "يوم", value: days, progress: Math.min(days, 100) / 100 },
    { label: "ساعة", value: hours, progress: hours / 24 },
    { label: "دقيقة", value: minutes, progress: minutes / 60 },
    { label: "ثانية", value: seconds, progress: seconds / 60 },
  ];

  const { date } = wedding;

  return (
    <section className="sec">
      <Reveal y={60} amount={0.2}>
        <div className="panel">
          <svg
            width="0"
            height="0"
            aria-hidden="true"
            style={{ position: "absolute" }}
          >
            <defs>
              <linearGradient id="cdGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff3c9" />
                <stop offset="0.5" stopColor="#e0b865" />
                <stop offset="1" stopColor="#a97c32" />
              </linearGradient>
            </defs>
          </svg>

          <Ornament />

          <h2 className="cd-title gold-text">
            {past ? "كانت ليلةً لا تُنسى" : "نلتقي بكم بعد"}
          </h2>
          <div className="cd-date">
            {date.day} · {date.month} · {date.year}
          </div>

          <div
            className="cd-grid"
            role="timer"
            aria-label="العدّ التنازلي لموعد الزفاف"
          >
            {units.map((u) => (
              <Unit key={u.label} {...u} />
            ))}
          </div>

          <p className="cd-message">
            {past ? (
              <span>شكرًا لكل من شاركنا فرحتنا</span>
            ) : (
              <>
                <span>العدّ التنازلي لأجمل ليلة</span>
                <span>حتى نحتفل معًا ببداية حكاية جديدة</span>
              </>
            )}
          </p>

          {!past && (
            <button type="button" className="btn-outline" onClick={downloadICS}>
              <span aria-hidden="true">✦</span>
              أضف الموعد إلى تقويمك
            </button>
          )}
        </div>
      </Reveal>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Mandala from "../ui/Mandala";
import Ornament from "../ui/Ornament";
import { starPath } from "@/lib/geometry";
import { wedding } from "@/lib/wedding";

const EASE = [0.22, 1, 0.36, 1];

const rise = (delay) => ({
  initial: { opacity: 0, y: 28, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 1.2, delay, ease: EASE },
});

// كشف الاسم من اليمين لليسار (مثل اتجاه القراءة)
const wipe = (delay) => ({
  initial: { clipPath: "inset(-30% -10% -30% 110%)", opacity: 0 },
  animate: { clipPath: "inset(-30% -10% -30% -10%)", opacity: 1 },
  transition: { duration: 1.5, delay, ease: EASE },
});

// تحريك الطائر
const birdFly = {
  initial: { x: "-100vw", y: 0, opacity: 0 },
  animate: {
    x: "110vw",
    y: [0, -60, 40, -30, 0],
    opacity: [0, 1, 1, 1, 0],
    rotate: [0, 15, -15, 15, 0],
  },
  transition: {
    duration: 8,
    delay: 2,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 4,
  },
};

// مكون الطائر
function Bird() {
  return (
    <motion.div
      className="absolute top-1/4 left-0 pointer-events-none"
      {...birdFly}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* جسم الطائر */}
        <ellipse cx="20" cy="20" rx="6" ry="8" fill="#d4a574" />

        {/* الرأس */}
        <circle cx="20" cy="14" r="4" fill="#d4a574" />

        {/* العين */}
        <circle cx="22" cy="13" r="1.5" fill="#2c1810" />

        {/* المنقار */}
        <path
          d="M 24 13 L 28 12"
          stroke="#c68642"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* الأجنحة - اليمين */}
        <path
          d="M 16 18 Q 10 14 8 18 Q 10 22 16 20"
          fill="#b8956e"
          opacity="0.8"
        />

        {/* الأجنحة - اليسار */}
        <path
          d="M 24 18 Q 30 14 32 18 Q 30 22 24 20"
          fill="#d4a574"
          opacity="0.9"
        />

        {/* الذيل */}
        <path
          d="M 14 24 Q 10 26 8 28"
          stroke="#b8956e"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 14 22 Q 8 20 6 24"
          stroke="#b8956e"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

export default function Hero() {
  const { couple, parents, date } = wedding;

  return (
    <section className="hero relative overflow-hidden">
      {/* الطائر */}
      <Bird />

      <div className="hero-mandala">
        <Mandala />
      </div>
      <div className="hero-halo" />
      <motion.p className="hero-bismillah gold-text" {...rise(0.5)}>
        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
      </motion.p>
      <motion.div {...rise(0.7)}>
        <Ornament />
      </motion.div>
      <motion.div className="hero-parents" {...rise(0.9)}>
        <div className="parent">
          <span className="parent-title">{parents.first.title}</span>
          <span className="parent-name">{parents.first.name}</span>
        </div>

        <div className="parents-sep" aria-hidden="true">
          <i />
          <span>✦</span>
          <i />
        </div>

        <div className="parent">
          <span className="parent-title">{parents.second.title}</span>
          <span className="parent-name">{parents.second.name}</span>
        </div>
      </motion.div>
      <motion.p className="hero-invite" {...rise(1.15)}>
        يتشرفان بدعوتكم
        <br />
        بمناسبة زفافهما
      </motion.p>

      <div className="names">
        <motion.span className="name gold-text" {...wipe(1.9)}>
          {couple.bride}
        </motion.span>

        <motion.span
          className="name-separator"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.3, ease: EASE }}
        >
          &
        </motion.span>

        <motion.span className="name gold-text" {...wipe(2.6)}>
          {couple.groom}
        </motion.span>
      </div>

      <motion.p className="hero-closing" {...rise(3.2)}>
        <span>ليشاركونا فرحة العمر</span>
        <span>في ليلةٍ من أجمل ليالي العمر</span>
      </motion.p>
      <motion.div {...rise(3.5)}>
        <div
          className="date-row"
          aria-label={`${date.day} / ${date.month} / ${date.year}`}
        >
          <span>{date.day}</span>
          <i />
          <span>{date.month}</span>
          <i />
          <span>{date.year}</span>
        </div>
        <div className="date-meta">
          <span>يوم {date.weekday}</span>
          <b>✦</b>
          <span>الساعة {date.time}</span>
        </div>
      </motion.div>
      <motion.div
        className="scroll-cue"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.4, duration: 1 }}
      />
    </section>
  );
}

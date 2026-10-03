"use client";

import { motion } from "framer-motion";
import IslamicPattern from "./ui/IslamicPattern";
import { polar, starPath } from "@/lib/geometry";
import { wedding } from "@/lib/wedding";

const EASE_DOOR = [0.65, 0, 0.2, 1];

// نجوم معلّقة بخيوط ذهبية
const HANGING = [
  { x: "12%", len: "16svh", size: 26, delay: "0s" },
  { x: "31%", len: "8svh", size: 18, delay: "-1.3s" },
  { x: "69%", len: "12svh", size: 22, delay: "-2.1s" },
  { x: "88%", len: "20svh", size: 30, delay: "-0.6s" },
];

function HangingStars({ hidden }) {
  return (
    <div className={`hang${hidden ? " is-hidden" : ""}`} aria-hidden="true">
      {HANGING.map((s, i) => (
        <div
          key={i}
          className="hang-item"
          style={{ left: s.x, "--len": s.len, "--delay": s.delay }}
        >
          <i className="hang-thread" />
          <svg className="hang-star" width={s.size} height={s.size} viewBox="-50 -50 100 100">
            <defs>
              <linearGradient id={`hg${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff3c9" />
                <stop offset="1" stopColor="#c99b45" />
              </linearGradient>
            </defs>
            <path d={starPath(0, 0, 46, 22, 8)} fill={`url(#hg${i})`} />
          </svg>
        </div>
      ))}
    </div>
  );
}

const TICKS = Array.from({ length: 48 }, (_, i) => {
  const deg = i * 7.5;
  const long = i % 4 === 0;
  const [x1, y1] = polar(50, 50, long ? 44.5 : 46, deg);
  const [x2, y2] = polar(50, 50, 49, deg);
  return { x1: x1.toFixed(2), y1: y1.toFixed(2), x2: x2.toFixed(2), y2: y2.toFixed(2), long };
});

function Leaf({ side, opened }) {
  const dir = side === "left" ? 1 : -1;

  return (
    <motion.div
      className={`leaf leaf--${side}`}
      initial={false}
      animate={
        opened
          ? { rotateY: 104 * dir, filter: "brightness(0.35)" }
          : { rotateY: 0, filter: "brightness(1)" }
      }
      transition={{ duration: 2.1, ease: EASE_DOOR }}
    >
      <div className="leaf-panel">
        <IslamicPattern uid={`pat-${side}`} />
        <div className="leaf-inlay" />
        <div className="leaf-inlay-2" />
      </div>
    </motion.div>
  );
}

export default function Gate({ phase, onOpen }) {
  const started = phase !== "idle";
  const opened = phase === "doors" || phase === "zoom";
  const zooming = phase === "zoom";
  const [a, b] = wedding.couple.initials;

  return (
    <div className="gate" data-phase={phase}>
      <HangingStars hidden={started} />

      <motion.header
        className="gate-top"
        initial={{ opacity: 0, y: -18 }}
        animate={started ? { opacity: 0, y: -14 } : { opacity: 1, y: 0 }}
        transition={{ duration: started ? 0.5 : 1.2, delay: started ? 0 : 0.5, ease: "easeOut" }}
      >
        <p className="gate-bismillah gold-text">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ</p>
        <span className="gate-kicker">دعوة زفاف</span>
      </motion.header>

      <div className="gate-stage">
        <motion.div
          className="gate-zoom"
          initial={false}
          animate={{ scale: zooming ? 9 : 1 }}
          transition={
            zooming
              ? { duration: 2, ease: [0.55, 0, 1, 0.45] }
              : { duration: 0.4 }
          }
        >
          <div className="gate-frame">
            <div className="gate-frame-inner">
              <div className="gate-opening">
                {/* الضوء خلف الباب */}
                <motion.div
                  className="light"
                  initial={false}
                  animate={opened ? { opacity: 1, scale: 1.15 } : { opacity: 0, scale: 0.6 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  <div className="light-rays" />
                </motion.div>

                <Leaf side="left" opened={opened} />
                <Leaf side="right" opened={opened} />

                {/* خط الضوء بين الدرفتين */}
                <motion.i
                  className="seam"
                  initial={false}
                  animate={{ opacity: started ? 0 : 1 }}
                  transition={{ duration: 0.4 }}
                />

                {/* الختم الذهبي */}
                <div className="seal-wrap">
                  <motion.span
                    className="shockwave"
                    initial={false}
                    animate={started ? { scale: [0.5, 5], opacity: [0.9, 0] } : { opacity: 0 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                  <motion.button
                    type="button"
                    className="seal"
                    onClick={onOpen}
                    disabled={started}
                    aria-label="افتح الدعوة"
                    initial={false}
                    animate={
                      started
                        ? { scale: [1, 1.15, 1.9], opacity: [1, 1, 0] }
                        : { scale: 1, opacity: 1 }
                    }
                    transition={
                      started
                        ? { duration: 0.7, times: [0, 0.35, 1], ease: "easeOut" }
                        : { duration: 0.3 }
                    }
                    whileHover={started ? undefined : { scale: 1.07 }}
                    whileTap={started ? undefined : { scale: 0.95 }}
                  >
                    <span className="seal-pulse" />
                    <span className="seal-pulse seal-pulse--2" />
                    <svg className="seal-ring" viewBox="0 0 100 100" aria-hidden="true">
                      {TICKS.map((t, i) => (
                        <line
                          key={i}
                          x1={t.x1}
                          y1={t.y1}
                          x2={t.x2}
                          y2={t.y2}
                          stroke="currentColor"
                          strokeWidth={t.long ? 0.9 : 0.5}
                        />
                      ))}
                    </svg>
                    <span className="seal-core">
                      <span className="seal-letter">{a}</span>
                      <span className="seal-amp">&amp;</span>
                      <span className="seal-letter">{b}</span>
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="gate-floor" />
      </div>

      <motion.p
        className="gate-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? 0 : 1 }}
        transition={{ duration: started ? 0.4 : 1, delay: started ? 0 : 1.6 }}
      >
        <span className="hint-dot" />
        المس الختم لفتح الدعوة
        <span className="hint-dot" />
      </motion.p>

      {/* وهج أبيض-ذهبي يغطي الشاشة بنهاية الدخول من الباب */}
      <motion.div
        className="gate-flash"
        initial={false}
        animate={{ opacity: zooming ? 1 : 0 }}
        transition={{ duration: 1, delay: zooming ? 0.85 : 0, ease: "easeIn" }}
      />
    </div>
  );
}

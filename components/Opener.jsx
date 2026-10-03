"use client";

import { motion } from "framer-motion";
import Bird from "./ui/Bird";
import Ornament from "./ui/Ornament";
import LeafPattern from "./ui/LeafPattern";
import { polar } from "@/lib/geometry";
import { wedding } from "@/lib/wedding";

const EASE_FLAP = [0.65, 0, 0.2, 1];
const EASE_RISE = [0.22, 1, 0.36, 1];

const TICKS = Array.from({ length: 48 }, (_, i) => {
  const deg = i * 7.5;
  const long = i % 4 === 0;
  const [x1, y1] = polar(50, 50, long ? 44.5 : 46, deg);
  const [x2, y2] = polar(50, 50, 49, deg);
  return {
    x1: x1.toFixed(2),
    y1: y1.toFixed(2),
    x2: x2.toFixed(2),
    y2: y2.toFixed(2),
    long,
  };
});

export default function Opener({ phase, onOpen }) {
  const started = phase !== "idle";
  const opened = phase === "open" || phase === "rise" || phase === "zoom";
  const rising = phase === "rise" || phase === "zoom";
  const zooming = phase === "zoom";
  const { couple } = wedding;
  const [a, b] = couple.initials;

  return (
    <div className="opener" data-phase={phase}>
      <motion.header
        className="opener-top"
        initial={{ opacity: 0, y: -18 }}
        animate={started ? { opacity: 0, y: -14 } : { opacity: 1, y: 0 }}
        transition={{
          duration: started ? 0.5 : 1.2,
          delay: started ? 0 : 0.5,
          ease: "easeOut",
        }}
      >
        <p className="opener-title gold-text">دعوة خاصة لكم</p>
        <span className="opener-kicker">حملها لكم عصفور الفرح</span>
      </motion.header>

      <div className="opener-stage">
        {/* العصفور: واقف على المغلّف، وأول ما تلمس الختم بيرفرف ويطير */}
        <motion.div
          className="opener-bird"
          initial={false}
          animate={
            opened
              ? {
                  x: [0, 20, -60, -300],
                  y: [0, -100, -220, -520],
                  rotate: [0, 10, 18, 22],
                  scale: [1, 1.15, 1, 0.6],
                  opacity: [1, 1, 1, 0],
                }
              : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
          }
          transition={
            opened
              ? { duration: 2.8, ease: "easeInOut", times: [0, 0.25, 0.6, 1] }
              : { duration: 0 }
          }
        >
          <Bird flying={started} />
        </motion.div>

        <motion.div
          className="opener-zoom"
          initial={false}
          animate={{ scale: zooming ? 9 : 1 }}
          transition={
            zooming
              ? { duration: 1.6, ease: [0.55, 0, 1, 0.45] }
              : { duration: 0.4 }
          }
        >
          <div className="env">
            <div className="env-back">
              <LeafPattern uid="pat-env" />
            </div>

            {/* البطاقة اللي بتطلع من المغلّف */}
            <motion.div
              className="env-card"
              initial={false}
              animate={{ y: rising ? "-62%" : "0%" }}
              transition={{ duration: 1.3, ease: EASE_RISE }}
            >
              <Ornament />
              <p className="card-small">دعوة زفاف</p>
              <p className="card-names gold-text">
                {couple.bride} &amp; {couple.groom}
              </p>
              <p className="card-small">يتشرفان بدعوتكم</p>
            </motion.div>

            <div className="env-front" />
            <svg
              className="env-lines"
              viewBox="0 0 100 68"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline points="0,0 50,36.7 100,0" />
            </svg>

            {/* الغطاء */}
            <motion.div
              className="env-flap"
              initial={false}
              animate={
                opened ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 5 }
              }
              transition={{
                rotateX: { duration: 1.1, ease: EASE_FLAP },
                zIndex: { delay: opened ? 0.35 : 0, duration: 0 },
              }}
            >
              <svg
                className="env-flap-lines"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon points="0,0 100,0 50,100" />
              </svg>
            </motion.div>
          </div>

          {/* الختم الذهبي */}
          <div className="seal-wrap">
            <motion.span
              className="shockwave"
              initial={false}
              animate={
                started
                  ? { scale: [0.5, 5], opacity: [0.9, 0] }
                  : { opacity: 0 }
              }
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
              <svg
                className="seal-ring"
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
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
        </motion.div>
      </div>

      <motion.p
        className="opener-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? 0 : 1 }}
        transition={{ duration: started ? 0.4 : 1, delay: started ? 0 : 1.6 }}
      >
        <span className="hint-dot" />
        المس الختم لفتح الدعوة
        <span className="hint-dot" />
      </motion.p>

      {/* وهج أبيض يغطي الشاشة بنهاية التكبير */}
      <motion.div
        className="opener-flash"
        initial={false}
        animate={{ opacity: zooming ? 1 : 0 }}
        transition={{ duration: 0.9, delay: zooming ? 0.7 : 0, ease: "easeIn" }}
      />
    </div>
  );
}

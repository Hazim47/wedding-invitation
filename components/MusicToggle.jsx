"use client";

import { motion } from "framer-motion";

export default function MusicToggle({ state, onToggle }) {
  if (state !== "playing" && state !== "paused") return null;
  const playing = state === "playing";

  return (
    <motion.button
      type="button"
      className={`music${playing ? "" : " is-paused"}`}
      onClick={onToggle}
      aria-label={playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
      aria-pressed={playing}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <span className="eq" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </motion.button>
  );
}

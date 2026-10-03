"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import GoldDust from "./GoldDust";
import Opener from "./Opener";
import Invitation from "./Invitation";
import MusicToggle from "./MusicToggle";
import { wedding } from "@/lib/wedding";

// تسلسل الفتح (بالميلي ثانية من لحظة اللمس)
//   0     → الختم ينفجر + تبدأ الأغنية + العصفور يرفرف
//   450   → الغطاء ينفتح والعصفور يطير
//   1500  → البطاقة تطلع من المغلّف
//   2900  → البطاقة تكبر لحد ما الشاشة تصير بيضاء
//   4300  → نبدّل للدعوة
//   6300  → انتهى
const FULL = { open: 450, rise: 1500, zoom: 2900, reveal: 4300, done: 6300 };
const SOFT = { reveal: 700, done: 1500 }; // لمن يكون المستخدم مفعّل "تقليل الحركة"

export default function Experience() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState("idle"); // idle | tap | open | rise | zoom | reveal | done
  const [burst, setBurst] = useState(0);
  const [music, setMusic] = useState("off"); // off | playing | paused | unavailable

  const audioRef = useRef(null);
  const fadeRef = useRef(0);
  const timers = useRef([]);
  const resumeRef = useRef(false);

  const revealed = phase === "reveal" || phase === "done";

  /* ------------------------------ الصوت ------------------------------ */

  const fadeTo = useCallback((target, ms, onDone) => {
    const a = audioRef.current;
    if (!a) return;
    cancelAnimationFrame(fadeRef.current);
    const from = a.volume;
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      const eased = 1 - Math.pow(1 - k, 2);
      a.volume = Math.min(1, Math.max(0, from + (target - from) * eased));
      if (k < 1) fadeRef.current = requestAnimationFrame(tick);
      else onDone?.();
    };
    fadeRef.current = requestAnimationFrame(tick);
  }, []);

  const startMusic = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.volume = 0;
      a.currentTime = 0;
      await a.play();
      setMusic("playing");
      fadeTo(wedding.music.volume, 4200);
    } catch {
      setMusic("unavailable");
    }
  }, [fadeTo]);

  const toggleMusic = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    if (music === "playing") {
      setMusic("paused");
      fadeTo(0, 500, () => a.pause());
    } else if (music === "paused") {
      try {
        await a.play();
        setMusic("playing");
        fadeTo(wedding.music.volume, 800);
      } catch {
        setMusic("unavailable");
      }
    }
  }, [music, fadeTo]);

  // نوقف الأغنية لما يطلع من التبويب ونرجعها لما يرجع
  useEffect(() => {
    const onVisibility = () => {
      const a = audioRef.current;
      if (!a) return;
      if (document.hidden && music === "playing") {
        a.pause();
        resumeRef.current = true;
      } else if (!document.hidden && resumeRef.current) {
        resumeRef.current = false;
        a.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [music]);

  /* ------------------------------ الفتح ------------------------------ */

  const open = useCallback(() => {
    if (phase !== "idle") return;

    startMusic(); // لازم ينندهي مباشرة داخل ضغطة المستخدم
    setBurst((b) => b + 1);
    setPhase("tap");

    const at = (ms, next) =>
      timers.current.push(setTimeout(() => setPhase(next), ms));

    if (reduce) {
      at(SOFT.reveal, "reveal");
      at(SOFT.done, "done");
      return;
    }
    at(FULL.open, "open");
    at(FULL.rise, "rise");
    at(FULL.zoom, "zoom");
    at(FULL.reveal, "reveal");
    at(FULL.done, "done");
  }, [phase, reduce, startMusic]);

  // قفل السكرول لحد ما تنفتح الدعوة
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("is-locked", !revealed);
    return () => root.classList.remove("is-locked");
  }, [revealed]);

  useEffect(() => {
    if (phase === "reveal") window.scrollTo(0, 0);
  }, [phase]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      cancelAnimationFrame(fadeRef.current);
    },
    [],
  );

  return (
    <MotionConfig reducedMotion="user">
      <audio
        ref={audioRef}
        src={wedding.music.src}
        preload="auto"
        loop
        onError={() => setMusic("unavailable")}
      />

      <GoldDust burstKey={burst} />

      {revealed && <Invitation />}
      {!revealed && <Opener phase={phase} onOpen={open} />}

      {phase === "reveal" && (
        <motion.div
          className="flash"
          style={{ background: "#ffffff" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.6 : 1.8, ease: "easeOut" }}
        />
      )}

      {revealed && <MusicToggle state={music} onToggle={toggleMusic} />}
    </MotionConfig>
  );
}

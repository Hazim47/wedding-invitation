"use client";

import { useEffect, useRef } from "react";

// سماء الليل: نجوم تتلألأ + غبار ذهبي صاعد + شهب + انفجار شرارات عند فتح الختم
export default function Starfield({ burstKey = 0 }) {
  const canvasRef = useRef(null);
  const api = useRef({ burst: () => {} });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    let last = performance.now();
    let nextShoot = 4;
    let stars = [];
    let dust = [];
    let sparks = [];
    let shooting = null;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const rand = (a, b) => a + Math.random() * (b - a);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const starCount = Math.min(320, Math.round((w * h) / 5200));
      stars = Array.from({ length: starCount }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.3, 1.4),
        a: rand(0.25, 0.9),
        tw: rand(0.4, 1.6),
        ph: rand(0, Math.PI * 2),
        z: rand(0.3, 1.2),
        gold: Math.random() < 0.18,
      }));

      const dustCount = Math.min(70, Math.round((w * h) / 24000));
      dust = Array.from({ length: dustCount }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.6, 2),
        vy: rand(6, 18),
        vx: rand(-4, 4),
        a: rand(0.15, 0.55),
        ph: rand(0, Math.PI * 2),
      }));

      if (reduce) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // نجوم
      for (const s of stars) {
        const tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(t * s.tw + s.ph);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = s.gold ? "#f1d48f" : "#dfe8ff";
        ctx.beginPath();
        ctx.arc(s.x + pointer.x * s.z * 10, s.y + pointer.y * s.z * 10, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // غبار ذهبي
      ctx.fillStyle = "#f3d58f";
      for (const d of dust) {
        ctx.globalAlpha = d.a * (0.6 + 0.4 * Math.sin(t * 1.2 + d.ph));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // شهاب
      if (shooting) {
        const s = shooting;
        const k = s.life / s.max;
        const tailX = s.x - s.vx * 0.12;
        const tailY = s.y - s.vy * 0.12;
        const g = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        g.addColorStop(0, "rgba(255,244,210,0.95)");
        g.addColorStop(1, "rgba(255,244,210,0)");
        ctx.globalAlpha = 1 - k;
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      // شرارات الانفجار
      if (sparks.length) {
        ctx.globalCompositeOperation = "lighter";
        for (const p of sparks) {
          ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.globalAlpha = 1;
    };

    const step = (now) => {
      raf = requestAnimationFrame(step);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      for (const d of dust) {
        d.y -= d.vy * dt;
        d.x += (d.vx + Math.sin(t + d.ph) * 6) * dt;
        if (d.y < -4) {
          d.y = h + 4;
          d.x = rand(0, w);
        }
      }

      nextShoot -= dt;
      if (!shooting && nextShoot <= 0) {
        shooting = {
          x: rand(w * 0.35, w),
          y: rand(0, h * 0.35),
          vx: -rand(500, 800),
          vy: rand(250, 400),
          life: 0,
          max: rand(0.7, 1.1),
        };
        nextShoot = rand(6, 12);
      }
      if (shooting) {
        shooting.x += shooting.vx * dt;
        shooting.y += shooting.vy * dt;
        shooting.life += dt;
        if (shooting.life >= shooting.max) shooting = null;
      }

      if (sparks.length) {
        for (const p of sparks) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.life += dt;
        }
        sparks = sparks.filter((p) => p.life < p.max);
      }

      draw();
    };

    api.current.burst = () => {
      if (reduce) return;
      const cx = w / 2;
      const cy = h * 0.5;
      const colors = ["#fff3c9", "#f6d98a", "#e0b865", "#ffe9a8"];
      for (let i = 0; i < 150; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(80, 520);
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          r: rand(1, 3),
          life: 0,
          max: rand(0.8, 1.8),
          color: colors[(Math.random() * colors.length) | 0],
        });
      }
    };

    const onPointer = (e) => {
      pointer.tx = (e.clientX / w - 0.5) * 2;
      pointer.ty = (e.clientY / h - 0.5) * 2;
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduce) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  useEffect(() => {
    if (burstKey > 0) api.current.burst();
  }, [burstKey]);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}

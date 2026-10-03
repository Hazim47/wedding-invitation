"use client";

import { useEffect, useRef } from "react";

// غبار ذهبي لامع + ريش ذهبي يتساقط ببطء + انفجار شرارات وريش لما العصفور يطير
export default function GoldDust({ burstKey = 0 }) {
  const canvasRef = useRef(null);
  const api = useRef({ burst: () => {} });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    let last = performance.now();
    let glitter = [];
    let feathers = [];
    let sparks = [];
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const rand = (a, b) => a + Math.random() * (b - a);
    const GOLDS = ["#c9a24d", "#d9b358", "#e6c36a", "#b98a3b"];

    const makeFeather = (x, y, burst = false) => ({
      x,
      y,
      s: rand(10, 20),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.8, 0.8),
      vx: burst ? rand(-160, 160) : rand(-8, 8),
      vy: burst ? rand(-220, -40) : rand(14, 30),
      ph: rand(0, Math.PI * 2),
      a: rand(0.35, 0.7),
      burst,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = Math.min(160, Math.round((w * h) / 9000));
      glitter = Array.from({ length: n }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.6, 1.9),
        a: rand(0.3, 0.85),
        tw: rand(0.6, 2),
        ph: rand(0, Math.PI * 2),
        z: rand(0.3, 1.2),
        cross: Math.random() < 0.22,
        c: GOLDS[(Math.random() * GOLDS.length) | 0],
      }));

      const fc = Math.min(9, Math.round(w / 90));
      feathers = Array.from({ length: fc }, () =>
        makeFeather(rand(0, w), rand(-h, h)),
      );

      if (reduce) draw();
    };

    const drawFeather = (f) => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rot);
      ctx.globalAlpha = f.a;
      ctx.fillStyle = "#e6c36a";
      ctx.strokeStyle = "#a97c32";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.ellipse(0, 0, f.s * 0.26, f.s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -f.s);
      ctx.lineTo(0, f.s * 1.25);
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const g of glitter) {
        const tw = reduce ? 1 : 0.4 + 0.6 * Math.abs(Math.sin(t * g.tw + g.ph));
        const x = g.x + pointer.x * g.z * 8;
        const y = g.y + pointer.y * g.z * 8;
        ctx.globalAlpha = g.a * tw;
        ctx.fillStyle = g.c;
        ctx.beginPath();
        ctx.arc(x, y, g.r, 0, Math.PI * 2);
        ctx.fill();
        if (g.cross) {
          ctx.strokeStyle = g.c;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(x - g.r * 4, y);
          ctx.lineTo(x + g.r * 4, y);
          ctx.moveTo(x, y - g.r * 4);
          ctx.lineTo(x, y + g.r * 4);
          ctx.stroke();
        }
      }

      for (const f of feathers) drawFeather(f);

      for (const p of sparks) {
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
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

      for (const f of feathers) {
        f.x += (f.vx + Math.sin(t * 1.3 + f.ph) * 22) * dt;
        f.y += f.vy * dt;
        f.rot += f.vr * dt;
        if (f.burst) {
          f.vx *= 0.97;
          f.vy = f.vy * 0.97 + 26 * dt;
          f.a -= dt * 0.12;
        }
      }
      feathers = feathers.filter((f) => !(f.burst && f.a <= 0));
      for (const f of feathers) {
        if (!f.burst && f.y > h + 30) {
          f.y = -30;
          f.x = rand(0, w);
        }
      }

      for (const p of sparks) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + 30 * dt;
        p.life += dt;
      }
      sparks = sparks.filter((p) => p.life < p.max);

      draw();
    };

    // انفجار من مكان الختم (وسط الشاشة تقريبًا)
    api.current.burst = () => {
      if (reduce) return;
      const cx = w / 2;
      const cy = h * 0.52;
      for (let i = 0; i < 130; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(80, 480);
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 60,
          r: rand(1, 3),
          life: 0,
          max: rand(0.9, 1.9),
          color: GOLDS[(Math.random() * GOLDS.length) | 0],
        });
      }
      for (let i = 0; i < 14; i++)
        feathers.push(
          makeFeather(cx + rand(-30, 30), cy + rand(-20, 20), true),
        );
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

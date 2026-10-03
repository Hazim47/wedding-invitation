"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "../ui/Reveal";
import IslamicPattern from "../ui/IslamicPattern";
import { wedding } from "@/lib/wedding";

const EASE = [0.22, 1, 0.36, 1];

export default function Venue() {
  const { venue, date } = wedding;
  const cardRef = useRef(null);
  const [imageOk, setImageOk] = useState(true);

  // البارالاكس: الصورة تتحرك أبطأ من الكرت
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <section className="sec">
      <Reveal>
        <span className="eyebrow">موقع الاحتفال</span>
        <h2 className="sec-title">
          حيث تبدأ
          <br />
          <span className="gold-text">أجمل لحظاتنا</span>
        </h2>
        <p className="sec-desc">
          يسعدنا أن نشارككم فرحتنا
          <br />
          في هذا المكان المميز
        </p>
      </Reveal>

      <motion.a
        ref={cardRef}
        href={venue.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="venue-card"
        initial={{ opacity: 0, y: 70, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.985 }}
        aria-label={`فتح موقع ${venue.name} على الخريطة`}
      >
        <div className="venue-frame">
          <div className="venue-arch">
            <IslamicPattern uid="pat-venue" />

            {imageOk && (
              <motion.img
                src={venue.image}
                alt={venue.name}
                style={{ y: imgY }}
                onError={() => setImageOk(false)}
              />
            )}

            <div className="venue-shade" />

            <div className="venue-info">
              <small>مكان الاحتفال</small>
              <strong>{venue.name}</strong>
              <em>{venue.address}</em>
              <span className="venue-open">
                فتح الموقع
                <b aria-hidden="true">↗</b>
              </span>
            </div>
          </div>
        </div>
      </motion.a>

      <Reveal delay={0.2} y={24}>
        <div className="venue-meta">
          <div className="venue-meta-item">
            <small>المدينة</small>
            <strong>{venue.city}</strong>
          </div>
          <span className="venue-meta-div" />
          <div className="venue-meta-item">
            <small>الموعد</small>
            <strong>
              {date.weekday} · {date.time}
            </strong>
          </div>
        </div>

        <div className="venue-welcome">
          <span aria-hidden="true">♡</span>
          ننتظركم بكل حب
          <span aria-hidden="true">♡</span>
        </div>
      </Reveal>
    </section>
  );
}

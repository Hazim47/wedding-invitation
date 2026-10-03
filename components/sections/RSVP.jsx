"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "../ui/Reveal";
import Ornament from "../ui/Ornament";
import { wedding } from "@/lib/wedding";

const EASE = [0.22, 1, 0.36, 1];

const GUEST_WORDS = {
  1: "شخص واحد",
  2: "شخصان",
};

const guestWord = (n) => GUEST_WORDS[n] ?? `${n} أشخاص`;

function Choice({ name, value, current, onChange, icon, children }) {
  return (
    <label className="choice">
      <input
        type="radio"
        name={name}
        value={value}
        checked={current === value}
        onChange={onChange}
      />

      <span className="choice-box">
        <span className="ic" aria-hidden="true">
          {icon}
        </span>

        <span>{children}</span>
      </span>
    </label>
  );
}

const collapse = {
  initial: {
    opacity: 0,
    height: 0,
    y: -10,
  },

  animate: {
    opacity: 1,
    height: "auto",
    y: 0,
  },

  exit: {
    opacity: 0,
    height: 0,
    y: -10,
  },

  transition: {
    duration: 0.35,
  },
};

const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  angle: (i * 360) / 14,
  dist: 58 + (i % 3) * 16,
}));

function Success({ attending }) {
  const { date } = wedding;

  return (
    <motion.div
      key="success"
      className="rsvp-success"
      initial={{
        opacity: 0,
        scale: 0.92,
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
        ease: EASE,
      }}
    >
      <div className="success-ring">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#d6b066"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.1,
              ease: "easeInOut",
            }}
          />

          <motion.path
            d={
              attending
                ? "M30 52 L44 65 L71 36"
                : "M50 30 C50 30 36 44 36 54 A14 14 0 0 0 64 54 C64 44 50 30 50 30 Z"
            }
            fill="none"
            stroke="#f5e0a3"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.9,
              ease: "easeOut",
            }}
          />
        </svg>

        {attending &&
          SPARKS.map((s, i) => {
            const rad = (s.angle * Math.PI) / 180;

            return (
              <motion.span
                key={i}
                className="success-spark"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0.4,
                }}
                animate={{
                  x: Math.cos(rad) * s.dist,
                  y: Math.sin(rad) * s.dist,
                  opacity: [0, 1, 0],
                  scale: [0.4, 1, 0.2],
                }}
                transition={{
                  duration: 1.4,
                  delay: 1.1,
                  ease: "easeOut",
                }}
              />
            );
          })}
      </div>

      <Ornament symbol="♡" />

      <h3 className="gold-text">
        {attending ? "شكرًا لكم" : "شكرًا لإبلاغنا"}
      </h3>

      <p>{attending ? "تم تسجيل تأكيد حضوركم بنجاح" : "تم تسجيل ردّكم"}</p>

      <small>
        {attending ? "سعدنا بمشاركتكم فرحتنا" : "سنفتقد وجودكم، ودمتم بخير"}
      </small>

      <div className="success-date">
        {date.day} · {date.month} · {date.year}
      </div>
    </motion.div>
  );
}

export default function RSVP() {
  const max = wedding.rsvp.maxGuests;

  const [form, setForm] = useState({
    fullName: "",
    side: "",
    attendance: "",
    guests: 1,
    message: "",
  });

  const [wantsMessage, setWantsMessage] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((f) => ({
      ...f,
      [name]: value,
    }));

    setErrors((er) => ({
      ...er,
      [name]: undefined,
    }));
  };

  const setGuests = (delta) => {
    setForm((f) => ({
      ...f,
      guests: Math.min(max, Math.max(1, f.guests + delta)),
    }));
  };

  const validate = () => {
    const er = {};

    if (form.fullName.trim().length < 2) {
      er.fullName = "يرجى كتابة الاسم الكامل";
    }

    if (!form.side) {
      er.side = "يرجى اختيار الطرف";
    }

    if (!form.attendance) {
      er.attendance = "يرجى تأكيد حضوركم أو اعتذاركم";
    }

    setErrors(er);

    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fullName: form.fullName.trim(),

          side: form.side,

          attendance: form.attendance,

          guests: form.attendance === "yes" ? Number(form.guests) : 0,

          message: wantsMessage ? form.message.trim() : "",

          website: "",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || "حدث خطأ أثناء الإرسال");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("RSVP submit error:", err);

      setServerError(
        err.message || "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sec">
      <Reveal y={70} amount={0.1}>
        <div className="panel">
          <AnimatePresence mode="wait">
            {submitted ? (
              <Success key="done" attending={form.attendance === "yes"} />
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <div className="rsvp-head">
                  <Ornament />

                  <span className="eyebrow" style={{ marginTop: 14 }}>
                    حضوركم يسعدنا
                  </span>

                  <h2 className="gold-text">تأكيد الحضور</h2>

                  <p>حضوركم يكمّل فرحتنا</p>
                </div>

                <form className="rsvp-form" onSubmit={onSubmit} noValidate>
                  {/* الاسم */}
                  <div>
                    <label className="field-label" htmlFor="fullName">
                      الاسم الكامل
                    </label>

                    <input
                      id="fullName"
                      className="input"
                      type="text"
                      name="fullName"
                      dir="auto"
                      autoComplete="name"
                      placeholder="اكتب اسمك الكامل"
                      value={form.fullName}
                      onChange={onChange}
                    />

                    {errors.fullName && (
                      <p className="field-error" role="alert">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* الطرف */}
                  <fieldset style={{ border: 0 }}>
                    <legend className="field-label">من أي طرف؟</legend>

                    <div className="choices">
                      <Choice
                        name="side"
                        value="groom"
                        current={form.side}
                        onChange={onChange}
                        icon="◈"
                      >
                        أهل العريس
                      </Choice>

                      <Choice
                        name="side"
                        value="bride"
                        current={form.side}
                        onChange={onChange}
                        icon="◈"
                      >
                        أهل العروس
                      </Choice>
                    </div>

                    {errors.side && (
                      <p className="field-error" role="alert">
                        {errors.side}
                      </p>
                    )}
                  </fieldset>

                  {/* الحضور */}
                  <fieldset style={{ border: 0 }}>
                    <legend className="field-label">
                      هل ستشاركوننا فرحتنا؟
                    </legend>

                    <div className="choices">
                      <Choice
                        name="attendance"
                        value="yes"
                        current={form.attendance}
                        onChange={onChange}
                        icon="✓"
                      >
                        بإذن الله سأحضر
                      </Choice>

                      <Choice
                        name="attendance"
                        value="no"
                        current={form.attendance}
                        onChange={onChange}
                        icon="×"
                      >
                        أعتذر عن الحضور
                      </Choice>
                    </div>

                    {errors.attendance && (
                      <p className="field-error" role="alert">
                        {errors.attendance}
                      </p>
                    )}
                  </fieldset>

                  {/* عدد الحضور */}
                  <AnimatePresence initial={false}>
                    {form.attendance === "yes" && (
                      <motion.div
                        key="guests"
                        style={{
                          overflow: "hidden",
                        }}
                        {...collapse}
                      >
                        <span className="field-label">عدد الحضور</span>

                        <div className="stepper">
                          <button
                            type="button"
                            onClick={() => setGuests(-1)}
                            disabled={form.guests <= 1}
                            aria-label="إنقاص العدد"
                          >
                            −
                          </button>

                          <output aria-live="polite">
                            <b>{form.guests}</b> {guestWord(form.guests)}
                          </output>

                          <button
                            type="button"
                            onClick={() => setGuests(1)}
                            disabled={form.guests >= max}
                            aria-label="زيادة العدد"
                          >
                            +
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* الرسالة */}
                  <button
                    type="button"
                    className="chip-toggle"
                    aria-expanded={wantsMessage}
                    onClick={() => setWantsMessage((v) => !v)}
                  >
                    <span aria-hidden="true">{wantsMessage ? "—" : "♡"}</span>

                    {wantsMessage ? "بدون رسالة" : "اترك رسالة للعروسين"}
                  </button>

                  <AnimatePresence initial={false}>
                    {wantsMessage && (
                      <motion.div
                        key="msg"
                        style={{
                          overflow: "hidden",
                        }}
                        {...collapse}
                      >
                        <label className="field-label" htmlFor="message">
                          رسالتكم للعرسان
                        </label>

                        <textarea
                          id="message"
                          className="input"
                          name="message"
                          rows={5}
                          maxLength={600}
                          placeholder="اكتبوا كلماتكم الجميلة للعروسين..."
                          value={form.message}
                          onChange={onChange}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Honeypot */}
                  <input
                    className="hp"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {serverError && (
                    <p className="form-error" role="alert">
                      {serverError}
                    </p>
                  )}

                  <button type="submit" className="btn-gold" disabled={loading}>
                    <span>
                      {loading ? "جاري إرسال التأكيد..." : "تأكيد الحضور"}
                    </span>

                    {!loading && <span aria-hidden="true">✦</span>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

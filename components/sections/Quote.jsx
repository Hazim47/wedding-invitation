"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import Bird from "../ui/Bird";
import { wedding } from "@/lib/wedding";

const EASE = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.3,
    },
  },
};

const word = {
  hidden: {
    opacity: 0,
    y: 14,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: EASE,
    },
  },
};

export default function Quote() {
  const { verse } = wedding;
  const words = verse.text.split(" ");

  return (
    <section className="sec verse">
      <motion.div
        className="verse-arch"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <Bird className="verse-bird" />

        <motion.p
          className="verse-text"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          {words.map((w, i) => (
            <Fragment key={i}>
              <motion.span className="w" variants={word}>
                {w}
              </motion.span>{" "}
            </Fragment>
          ))}
        </motion.p>

        <motion.div
          className="verse-ref"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span aria-hidden="true">♡</span>
          <span>{verse.reference}</span>
          <span aria-hidden="true">♡</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

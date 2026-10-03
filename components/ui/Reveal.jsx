"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 36,
  amount = 0.15,
  className,
}) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    amount,
    margin: "0px 0px -10% 0px",
  });

  const Tag = motion[as];

  return (
    <Tag
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y,
        filter: "blur(8px)",
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }
          : {
              opacity: 0,
              y,
              filter: "blur(8px)",
            }
      }
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Tag>
  );
}

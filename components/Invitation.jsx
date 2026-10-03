"use client";

import { motion, useScroll } from "framer-motion";
import Hero from "./sections/Hero";
import Quote from "./sections/Quote";
import Countdown from "./sections/Countdown";
import Venue from "./sections/Venue";
import RSVP from "./sections/RSVP";
import Footer from "./sections/Footer";

export default function Invitation() {
  const { scrollYProgress } = useScroll();

  return (
    <main className="invitation">
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} />
      <Hero />
      <Quote />
      <Countdown />
      <Venue />
      <RSVP />
      <Footer />
    </main>
  );
}

"use client";

import Header from '@/components/header';
import Hero from '@/components/hero';
import Footer from '@/components/footer';
import Benefits from '@/components/benefits';
import Comparison from '@/components/comparison';
import FinalCTA from '@/components/final.cta';
import Testimonials from '@/components/testimonials';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function ScrollReveal({ 
  children, 
  delay = 0 
}: { 
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px"
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* Header siempre visible */}
      <Header />

      {/* Hero con animación inicial */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Hero />
      </motion.div>

      {/* Secciones con scroll reveal */}
      <ScrollReveal>
        <Benefits />
      </ScrollReveal>

      <ScrollReveal>
        <Comparison />
      </ScrollReveal>

      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>

      <ScrollReveal>
        <FinalCTA />
      </ScrollReveal>

      {/* Footer sin animación */}
      <Footer />
    </main>
  );
}
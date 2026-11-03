"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

// Entradas al hacer scroll: resorte críticamente amortiguado (sin rebote) y
// recorridos cortos, para que acompañen sin distraer. Con "reducir movimiento"
// queda solo un fundido de opacidad.
const SPRING = { type: "spring" as const, bounce: 0, duration: 0.6 };
const DISTANCE = 24;

interface FadeInProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = SPRING.duration,
  className = "",
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const d = reduce ? 0 : DISTANCE;

  const offsets = {
    up: { y: d, x: 0 },
    down: { y: -d, x: 0 },
    left: { y: 0, x: d },
    right: { y: 0, x: -d },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offsets[direction] }}
      transition={{ ...SPRING, duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerChildrenProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerChildren({
  children,
  staggerDelay = 0.06,
  className = "",
}: StaggerChildrenProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : DISTANCE },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ ...SPRING, duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ScaleIn({ children, delay = 0, className = "" }: ScaleInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  const from = reduce ? 1 : 0.94;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: from }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: from }}
      transition={{ ...SPRING, duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

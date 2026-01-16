'use client';

import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';

interface SnowflakeProps {
  delay: number;
  duration: number;
  left: string;
  size: number;
}

function Snowflake({ delay, duration, left, size }: SnowflakeProps) {
  return (
    <motion.div
      className="absolute top-0 pointer-events-none select-none"
      style={{ left, fontSize: size }}
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: '100vh',
        opacity: [0, 1, 1, 0],
        x: [0, 10, -10, 5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      ☀️
    </motion.div>
  );
}

export default function Snow({ count = 20 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
  }, []);

  const snowflakes = useMemo(() => {
    if (!mounted) return [];
    const actualCount = isMobile ? Math.floor(count / 2) : count;
    return Array.from({ length: actualCount }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
      left: `${Math.random() * 100}%`,
      size: isMobile ? 8 + Math.random() * 8 : 8 + Math.random() * 12,
    }));
  }, [count, mounted, isMobile]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-30">
      {snowflakes.map((flake) => (
        <Snowflake
          key={flake.id}
          delay={flake.delay}
          duration={flake.duration}
          left={flake.left}
          size={flake.size}
        />
      ))}
    </div>
  );
}

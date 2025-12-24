'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getProgress, isGameCompleted } from '@/lib/progress';
import HomeButton from '@/components/HomeButton';
import { FINALE_MESSAGE } from '@/lib/constants';

export default function Finale() {
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const progress = getProgress();

    if (!progress.unlocked) {
      router.push('/');
      return;
    }

    if (!isGameCompleted()) {
      router.push('/hub');
      return;
    }

    // Start reveal animation
    setTimeout(() => {
      setRevealed(true);
      setShowConfetti(true);
    }, 800);

    // Stop confetti after a while
    setTimeout(() => {
      setShowConfetti(false);
    }, 6000);
  }, [router]);

  if (!mounted) return null;

  return (
    <main className="relative h-screen w-screen bg-[#1a1a1a] overflow-hidden flex items-center justify-center">
      <HomeButton />

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(60)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50vw',
                  y: '50vh',
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: [0, 1, 1],
                  rotate: Math.random() * 720 - 360,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: 'easeOut',
                }}
                className="absolute pointer-events-none text-2xl"
              >
                {['🍓', '❄', '🎄', '⭐', '🎁', '❤️'][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Folded note reveal */}
      <AnimatePresence>
        {!revealed ? (
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{
              scaleY: 0,
              originY: 0,
              transition: { duration: 0.8 },
            }}
            className="w-20 h-20 bg-[#c41e3a] rounded-sm shadow-2xl flex items-center justify-center"
            style={{ transformOrigin: 'center top' }}
          >
            <span className="text-4xl">🎁</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-[90vw] max-w-md mx-4"
          >
            {/* The revealed letter */}
            <div
              className="relative bg-amber-50 p-8 sm:p-10 rounded-sm torn-edge"
              style={{
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              {/* Tape decorations */}
              <div className="absolute -top-2 left-8 w-12 h-5 bg-yellow-100/80 rotate-3" />
              <div className="absolute -top-2 right-8 w-12 h-5 bg-yellow-100/80 -rotate-2" />

              {/* Message content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <p className="font-[family-name:var(--font-spray)] text-4xl sm:text-5xl text-[#c41e3a] mb-4">
                  {FINALE_MESSAGE}
                </p>
                <p className="font-[family-name:var(--font-hand)] text-xl text-zinc-600">
                  🍓❤️🎄
                </p>
              </motion.div>

              {/* Signature flourish */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-6 text-center"
              >
                <span className="font-[family-name:var(--font-hand)] text-2xl text-zinc-500">
                  - D x
                </span>
              </motion.div>
            </div>

            {/* Glow behind */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -inset-8 -z-10 rounded-full bg-gradient-radial from-[#c41e3a]/30 to-transparent blur-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 1.5 }}
          className="absolute top-10 left-10 text-6xl"
        >
          🍓
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-10 right-10 text-4xl"
        >
          🎄
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 2 }}
          className="absolute top-20 right-20 text-3xl"
        >
          ❄
        </motion.div>
      </div>
    </main>
  );
}

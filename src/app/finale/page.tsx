'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getProgress, isAllComplete } from '@/lib/progress';
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

    if (!isAllComplete()) {
      router.push('/hub');
      return;
    }

    // Start reveal animation
    setTimeout(() => {
      setRevealed(true);
      setShowConfetti(true);
    }, 1000);

    // Stop confetti after a while
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  }, [router]);

  if (!mounted) return null;

  return (
    <main className="relative h-screen w-screen bg-[#1a1a1a] overflow-hidden flex items-center justify-center">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(50)].map((_, i) => (
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
                className="absolute pointer-events-none"
                style={{
                  width: `${8 + Math.random() * 12}px`,
                  height: `${8 + Math.random() * 12}px`,
                  backgroundColor: ['#ff6b35', '#00d4aa', '#ffffff', '#ffeb3b'][
                    Math.floor(Math.random() * 4)
                  ],
                  borderRadius: Math.random() > 0.5 ? '50%' : '0',
                }}
              />
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
            className="w-16 h-16 bg-amber-50 rounded-sm shadow-2xl"
            style={{ transformOrigin: 'center top' }}
          />
        ) : (
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-[90vw] max-w-md mx-4"
          >
            {/* The revealed letter */}
            <div
              className="relative bg-amber-50 p-6 sm:p-8 rounded-sm torn-edge"
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
                className="font-[family-name:var(--font-hand)] text-lg sm:text-xl text-zinc-800 leading-relaxed whitespace-pre-line"
              >
                {FINALE_MESSAGE}
              </motion.div>

              {/* Signature flourish */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="mt-6 text-right"
              >
                <span className="font-[family-name:var(--font-spray)] text-2xl text-[#ff6b35]">
                  ♥
                </span>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full border-4 border-amber-200/30 opacity-20" />
            </div>

            {/* Spray paint burst behind */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -inset-8 -z-10 rounded-full bg-gradient-radial from-[#ff6b35]/30 to-transparent blur-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 1.5 }}
          className="absolute top-10 left-10 font-[family-name:var(--font-spray)] text-6xl text-[#00d4aa]"
        >
          ✓
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-10 right-10 font-[family-name:var(--font-spray)] text-4xl text-[#ff6b35]"
        >
          ★
        </motion.div>
      </div>
    </main>
  );
}

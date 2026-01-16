'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BDAY_PASSWORD_NORMALIZED, BDAY_HINT_1, BDAY_HINT_2 } from '@/lib/constants';
import { getBdayProgress, setBdayUnlocked } from '@/lib/progress';

export default function BirthdayLanding() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [showArchive, setShowArchive] = useState(false);
  const router = useRouter();

  const handleTitleTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      setShowArchive(true);
    }
  };

  // Don't auto-redirect - let them click enter each time

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Normalize input: lowercase, remove spaces
    const input = password.toLowerCase().trim().replace(/\s+/g, '');
    if (input === BDAY_PASSWORD_NORMALIZED) {
      setUnlocking(true);
      setBdayUnlocked(true);
      setTimeout(() => {
        router.push('/tour');
      }, 1500);
    } else {
      setError(true);
      setWrongGuesses((prev) => prev + 1);
      setTimeout(() => setError(false), 500);
    }
  };

  const currentHint = wrongGuesses >= 3 ? BDAY_HINT_2 : BDAY_HINT_1;

  return (
    <main className="relative min-h-screen w-screen flex flex-col items-center justify-center bg-[#FFF8E7] overflow-hidden">
      {/* Playful background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Confetti elements */}
        <motion.div
          className="absolute top-[20%] left-[30%] w-3 h-3 rounded-full bg-[#FF6B6B]"
          animate={{ y: [0, 10, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-[35%] right-[25%] w-2 h-2 rounded-full bg-[#FFD93D]"
          animate={{ y: [0, -8, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[40%] left-[35%] w-2.5 h-2.5 rounded-full bg-[#6BCB77]"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-[60%] right-[35%] w-2 h-2 rounded-full bg-[#FF6B6B]"
          animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Scratchy border frame */}
      <div className="absolute inset-4 sm:inset-8 border-4 border-dashed border-[#FF6B6B]/30 rounded-lg pointer-events-none" />

      <AnimatePresence>
        {!unlocking ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: -50,
              transition: { duration: 0.6 }
            }}
            className={`flex flex-col items-center gap-8 z-10 px-6 ${error ? 'shake' : ''}`}
          >
            {/* Birthday subtitle */}
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-[family-name:var(--font-hand)] text-xl sm:text-2xl text-[#FF6B6B] tracking-wide"
            >
              Happy Birthday
            </motion.span>

            {/* Main name - big spray paint style (tap 5x for archive) */}
            <motion.h1
              onClick={handleTitleTap}
              className="text-6xl sm:text-8xl font-[family-name:var(--font-spray)] text-[#2D2D2D] cursor-pointer select-none"
              style={{
                textShadow: '3px 3px 0 #FF6B6B, 6px 6px 0 rgba(0,0,0,0.1)',
                transform: 'rotate(-1deg)'
              }}
            >
              LivWahGow
            </motion.h1>

            {/* Food tour subtitle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-[#FFD93D] px-4 py-2 rounded-sm transform rotate-1"
              style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.1)' }}
            >
              <span className="font-[family-name:var(--font-hand)] text-lg sm:text-xl text-[#2D2D2D]">
                Food Tour Edition
              </span>
            </motion.div>

            {/* Password input */}
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 mt-4">
              <div className="relative">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="..."
                  className="bg-white/80 border-3 border-[#2D2D2D] border-dashed
                           text-center text-2xl font-[family-name:var(--font-hand)] text-[#2D2D2D]
                           w-64 py-4 rounded-sm outline-none transition-all
                           focus:border-[#FF6B6B] focus:border-solid
                           placeholder:text-[#2D2D2D]/30"
                  style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.1)' }}
                  autoFocus
                  autoComplete="off"
                />
              </div>

              {/* Password hint */}
              <p className="font-[family-name:var(--font-hand)] text-sm text-[#2D2D2D]/50 text-center max-w-xs">
                {currentHint}
              </p>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="font-[family-name:var(--font-spray)] text-xl text-white
                         bg-[#FF6B6B] px-10 py-3 rounded-sm transform -rotate-1
                         hover:bg-[#ff5252] transition-colors"
                style={{ boxShadow: '3px 3px 0 #2D2D2D' }}
              >
                LET&apos;S EAT
              </motion.button>
            </form>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-[family-name:var(--font-hand)] text-xl text-[#FF6B6B]"
                >
                  nope, try again...
                </motion.p>
              )}
            </AnimatePresence>

            {/* Archive link */}
            <motion.a
              href="/christmas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="font-[family-name:var(--font-hand)] text-sm text-[#2D2D2D]/30 hover:text-[#2D2D2D]/50 transition-colors mt-4"
            >
              revisit christmas →
            </motion.a>
          </motion.div>
        ) : (
          /* Unlock animation */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 z-10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-4 border-[#FF6B6B] border-t-transparent rounded-full"
            />
            <p className="font-[family-name:var(--font-hand)] text-xl text-[#2D2D2D]/60">
              let&apos;s go...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

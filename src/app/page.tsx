'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PASSWORD_LOWER } from '@/lib/constants';
import { getProgress, setUnlocked } from '@/lib/progress';

export default function PasswordGate() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const progress = getProgress();
    if (progress.unlocked) {
      router.push('/hub');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const input = password.toLowerCase().trim();
    if (input === PASSWORD_LOWER) {
      setUnlocking(true);
      setUnlocked(true);
      setTimeout(() => {
        router.push('/hub');
      }, 1500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <main className="relative h-screen w-screen flex flex-col items-center justify-center bg-[#1a1a1a] overflow-hidden">
      {/* Background Christmas graffiti elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-5 text-6xl rotate-12 text-[#c41e3a]">❄</div>
        <div className="absolute top-20 right-10 text-4xl -rotate-6 text-[#228b22]">★</div>
        <div className="absolute bottom-32 left-10 text-3xl rotate-45 text-white">❄</div>
        <div className="absolute bottom-20 right-20 text-5xl -rotate-12 text-[#c41e3a]">✦</div>
        <div className="absolute top-1/2 left-[10%] text-2xl rotate-6 text-[#228b22]">❄</div>
        <div className="absolute top-[30%] right-[5%] text-3xl -rotate-12 text-white/50">✧</div>
      </div>

      {/* String lights across top */}
      <div className="absolute top-0 left-0 right-0 h-8 flex justify-around items-center opacity-60">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full ${i % 3 === 0 ? 'bg-[#c41e3a]' : i % 3 === 1 ? 'bg-[#228b22]' : 'bg-[#ffd700]'}`}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            style={{ boxShadow: `0 0 8px ${i % 3 === 0 ? '#c41e3a' : i % 3 === 1 ? '#228b22' : '#ffd700'}` }}
          />
        ))}
      </div>

      <AnimatePresence>
        {!unlocking ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -100,
              scale: 0.8,
              rotate: -5,
              transition: { duration: 0.8 }
            }}
            className={`flex flex-col items-center gap-12 z-10 ${error ? 'shake' : ''}`}
          >
              <span
                className="font-[family-name:var(--font-spray)] text-xl sm:text-2xl text-[#228b22] tracking-wider"
                style={{
                  textShadow: '2px 2px 0 #c41e3a, -1px -1px 0 #fff',
                  transform: 'rotate(3deg)',
                  display: 'inline-block'
                }}
              >
                MERRY CHRISTMAS
              </span>
            {/* Tag name - graffiti style */}
            <motion.h1
              className="text-7xl sm:text-9xl font-[family-name:var(--font-spray)] text-white paint-drip"
              style={{
                textShadow: '4px 4px 0 #c41e3a, 8px 8px 0 rgba(0,0,0,0.3)',
                transform: 'rotate(-2deg)'
              }}
            >
              Olivia 
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
            </motion.div>

            {/* Password hint */}
            <p className="font-[family-name:var(--font-hand)] text-sm text-white/40 -mt-2">
                Guess the password to enter 
              </p>

            {/* Password input */}
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="..."
                  className="bg-transparent border-b-4 border-white/50 focus:border-[#c41e3a]
                           text-center text-3xl font-[family-name:var(--font-hand)] text-white
                           w-64 py-4 outline-none transition-colors placeholder:text-white/30"
                  autoFocus
                  autoComplete="off"
                />
                {/* Scratched underline effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              {/* Password hint */}
              <p className="font-[family-name:var(--font-hand)] text-sm text-white/40 -mt-2">
                hint: a special someone who will be the name of your next company
              </p>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className="font-[family-name:var(--font-spray)] text-xl text-white
                         bg-[#c41e3a] px-8 py-3 rounded-sm transform rotate-1
                         hover:bg-[#a01830] transition-colors touch-highlight"
                style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}
              >
                ENTER
              </motion.button>
            </form>

            {/* Error hint */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-[family-name:var(--font-hand)] text-2xl text-[#c41e3a]"
                >
                  nah...
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Unlock animation - page tears away */
          <motion.div
            initial={{ opacity: 1 }}
            animate={{
              clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[#1a1a1a] z-50"
          />
        )}
      </AnimatePresence>

      {/* Paint drips on error */}
      <AnimatePresence>
        {error && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 1 }}
                animate={{ y: '100vh', opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
                className="absolute top-0 w-2 bg-[#c41e3a] rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  height: `${30 + Math.random() * 40}px`
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

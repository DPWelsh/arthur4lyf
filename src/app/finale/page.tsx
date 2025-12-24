'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getProgress, isGameCompleted } from '@/lib/progress';
import HomeButton from '@/components/HomeButton';
import { FINALE_MESSAGE } from '@/lib/constants';

const FINALE_VIDEO = 'https://res.cloudinary.com/dm3cqsapn/video/upload/v1766607837/dan-on-sled_aocmh7.mp4';

export default function Finale() {
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const router = useRouter();

  const handleVideoError = () => {
    setVideoFailed(true);
  };

  const handleRetry = () => {
    setVideoFailed(false);
  };

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

      {/* Gift box then video reveal */}
      <AnimatePresence>
        {!revealed ? (
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{
              scale: 0,
              rotate: 10,
              transition: { duration: 0.5 },
            }}
            className="w-24 h-24 bg-[#c41e3a] rounded-sm shadow-2xl flex items-center justify-center"
          >
            <span className="text-5xl">🎁</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-[90vw] max-w-md mx-4"
          >
            {/* Message above video */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4 text-center"
            >
              <p className="font-[family-name:var(--font-spray)] text-3xl sm:text-4xl text-[#c41e3a]">
                {FINALE_MESSAGE}
              </p>
            </motion.div>

            {/* Video */}
            {!videoFailed ? (
              <video
                autoPlay
                loop
                playsInline
                muted
                onError={handleVideoError}
                className="w-full rounded-sm shadow-2xl"
                aria-label="Surprise video message"
              >
                <source src={FINALE_VIDEO} type="video/mp4" />
              </video>
            ) : (
              <div
                className="w-full aspect-video bg-zinc-800 rounded-sm shadow-2xl flex flex-col items-center justify-center gap-4"
                role="img"
                aria-label="Video failed to load"
              >
                <p className="font-[family-name:var(--font-hand)] text-lg text-white/60">
                  video failed to load
                </p>
                <button
                  onClick={handleRetry}
                  className="font-[family-name:var(--font-hand)] text-lg text-white/80 hover:text-white underline"
                >
                  tap to retry
                </button>
              </div>
            )}

            {/* Signature below video */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-center"
            >
              <p className="font-[family-name:var(--font-hand)] text-xl text-white/60">
                from your secret admirer x
              </p>
            </motion.div>
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

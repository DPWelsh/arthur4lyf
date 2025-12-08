'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getProgress, getNextPuzzle, isAllComplete } from '@/lib/progress';

const PUZZLE_POSITIONS = [
  { x: '15%', y: '25%', rotate: -8, label: '???' },
  { x: '70%', y: '20%', rotate: 5, label: '???' },
  { x: '25%', y: '55%', rotate: -3, label: '???' },
  { x: '65%', y: '60%', rotate: 7, label: '???' },
  { x: '45%', y: '80%', rotate: -5, label: '???' },
];

export default function Hub() {
  const [progress, setProgress] = useState({ completedPuzzles: [] as number[], unlocked: false });
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const p = getProgress();
    if (!p.unlocked) {
      router.push('/');
      return;
    }
    setProgress(p);

    if (isAllComplete()) {
      router.push('/finale');
    }
  }, [router]);

  const nextPuzzle = getNextPuzzle();

  const handlePuzzleClick = (puzzleId: number) => {
    if (puzzleId <= nextPuzzle) {
      router.push(`/puzzle/${puzzleId}`);
    }
  };

  if (!mounted) return null;

  return (
    <main className="relative h-screen w-screen bg-[#1a1a1a] overflow-hidden">
      {/* Chaotic background collage */}
      <div className="absolute inset-0">
        {/* Spray paint splatters */}
        <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-[#ff6b35]/20 blur-xl" />
        <div className="absolute top-[60%] right-[10%] w-48 h-48 rounded-full bg-[#00d4aa]/15 blur-2xl" />
        <div className="absolute bottom-[20%] left-[20%] w-24 h-24 rounded-full bg-white/10 blur-lg" />

        {/* Random scrawls and marks */}
        <div className="absolute top-[5%] right-[15%] text-4xl opacity-20 rotate-12 font-[family-name:var(--font-spray)]">✗</div>
        <div className="absolute top-[40%] left-[8%] text-3xl opacity-15 -rotate-6 font-[family-name:var(--font-spray)]">★</div>
        <div className="absolute bottom-[10%] right-[25%] text-5xl opacity-10 rotate-45">◯</div>
        <div className="absolute top-[70%] left-[60%] text-2xl opacity-20 -rotate-12">△</div>

        {/* Torn paper texture lines */}
        <div className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 left-[70%] w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      {/* Progress indicator - 5 small tags */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {[1, 2, 3, 4, 5].map((id) => (
          <motion.div
            key={id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: id * 0.1 }}
            className={`w-3 h-3 rounded-full border-2 ${
              progress.completedPuzzles.includes(id)
                ? 'bg-[#00d4aa] border-[#00d4aa]'
                : id === nextPuzzle
                ? 'bg-transparent border-[#ff6b35] animate-pulse'
                : 'bg-transparent border-white/30'
            }`}
          />
        ))}
      </div>

      {/* Puzzle entry points */}
      <AnimatePresence>
        {PUZZLE_POSITIONS.map((pos, idx) => {
          const puzzleId = idx + 1;
          const isCompleted = progress.completedPuzzles.includes(puzzleId);
          const isAvailable = puzzleId <= nextPuzzle;
          const isNext = puzzleId === nextPuzzle;

          if (!isAvailable) return null;

          return (
            <motion.button
              key={puzzleId}
              initial={{ opacity: 0, scale: 0, rotate: pos.rotate - 20 }}
              animate={{ opacity: 1, scale: 1, rotate: pos.rotate }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: puzzleId * 0.15, type: 'spring' }}
              onClick={() => handlePuzzleClick(puzzleId)}
              className={`absolute touch-highlight ${
                isCompleted ? 'opacity-50' : ''
              }`}
              style={{
                left: pos.x,
                top: pos.y,
                transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
              }}
            >
              <div
                className={`relative px-6 py-4 font-[family-name:var(--font-spray)] text-xl
                          ${isCompleted
                            ? 'bg-[#00d4aa]/80 text-[#1a1a1a]'
                            : isNext
                            ? 'bg-[#ff6b35] text-[#1a1a1a]'
                            : 'bg-white/90 text-[#1a1a1a]'
                          }
                          sticker`}
              >
                {isCompleted ? '✓' : isNext ? '?' : pos.label}

                {/* Animated glow for next puzzle */}
                {isNext && !isCompleted && (
                  <motion.div
                    className="absolute inset-0 bg-[#ff6b35] rounded-sm -z-10"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Center title/hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
      >
        <h1 className="font-[family-name:var(--font-hand)] text-2xl text-white/30">
          {progress.completedPuzzles.length === 0 && "find the way..."}
          {progress.completedPuzzles.length > 0 && progress.completedPuzzles.length < 5 && "keep going..."}
        </h1>
      </motion.div>

      {/* Decorative stickers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 right-8 font-[family-name:var(--font-spray)] text-sm text-white/20 rotate-3"
      >
        {progress.completedPuzzles.length}/5
      </motion.div>
    </main>
  );
}

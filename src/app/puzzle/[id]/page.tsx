'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getProgress, completePuzzle, getNextPuzzle } from '@/lib/progress';
import MemoryMatch from '@/components/puzzles/MemoryMatch';
import WordUnscramble from '@/components/puzzles/WordUnscramble';
import Jigsaw from '@/components/puzzles/Jigsaw';
import AudioTrigger from '@/components/puzzles/AudioTrigger';
import Riddle from '@/components/puzzles/Riddle';

const PUZZLE_TITLES = [
  'remember?',
  'unscramble',
  'piece it together',
  'listen...',
  'one last thing',
];

export default function PuzzlePage() {
  const router = useRouter();
  const params = useParams();
  const puzzleId = parseInt(params.id as string, 10);
  const [mounted, setMounted] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const progress = getProgress();
    if (!progress.unlocked) {
      router.push('/');
      return;
    }

    const nextPuzzle = getNextPuzzle();
    if (puzzleId > nextPuzzle) {
      router.push('/hub');
    }
  }, [puzzleId, router]);

  const handleComplete = () => {
    setCompleted(true);
    completePuzzle(puzzleId);

    setTimeout(() => {
      if (puzzleId >= 5) {
        router.push('/finale');
      } else {
        router.push('/hub');
      }
    }, 2000);
  };

  const handleBack = () => {
    router.push('/hub');
  };

  if (!mounted) return null;

  const renderPuzzle = () => {
    switch (puzzleId) {
      case 1:
        return <MemoryMatch onComplete={handleComplete} />;
      case 2:
        return <WordUnscramble onComplete={handleComplete} />;
      case 3:
        return <Jigsaw onComplete={handleComplete} />;
      case 4:
        return <AudioTrigger onComplete={handleComplete} />;
      case 5:
        return <Riddle onComplete={handleComplete} />;
      default:
        return <div>Puzzle not found</div>;
    }
  };

  return (
    <main className="relative h-screen w-screen bg-[#1a1a1a] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="font-[family-name:var(--font-spray)] text-white/60 hover:text-white transition-colors"
        >
          ← back
        </motion.button>
        <h2 className="font-[family-name:var(--font-hand)] text-xl text-white/40">
          {PUZZLE_TITLES[puzzleId - 1]}
        </h2>
        <div className="w-12" /> {/* Spacer for alignment */}
      </div>

      {/* Puzzle content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {renderPuzzle()}
      </div>

      {/* Completion overlay */}
      {completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[#1a1a1a]/90 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10 }}
            className="text-center"
          >
            <div className="font-[family-name:var(--font-spray)] text-6xl text-[#00d4aa] mb-4">
              ✓
            </div>
            <p className="font-[family-name:var(--font-hand)] text-2xl text-white">
              something new appeared...
            </p>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}

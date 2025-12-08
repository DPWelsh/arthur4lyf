'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RIDDLE_ANSWER } from '@/lib/constants';

interface RiddleProps {
  onComplete: () => void;
}

export default function Riddle({ onComplete }: RiddleProps) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = answer.toLowerCase().trim();

    if (input === RIDDLE_ANSWER.toLowerCase()) {
      onComplete();
    } else {
      setError(true);
      setAttempts((a) => a + 1);
      setTimeout(() => setError(false), 1000);
    }
  };

  const getHint = () => {
    if (attempts >= 5) return `Starts with "${RIDDLE_ANSWER[0].toUpperCase()}"...`;
    if (attempts >= 3) return "Think about books...";
    return null;
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md px-4">
      {/* Riddle text - styled as handwritten note */}
      <motion.div
        initial={{ opacity: 0, rotate: -5 }}
        animate={{ opacity: 1, rotate: -2 }}
        className="relative bg-amber-50 p-6 sm:p-8 w-full max-w-sm torn-edge"
        style={{
          boxShadow: '4px 4px 15px rgba(0,0,0,0.3)',
        }}
      >
        {/* Tape at top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-100/80 rotate-2" />

        {/* Riddle content */}
        <div className="font-[family-name:var(--font-hand)] text-xl sm:text-2xl text-zinc-800 leading-relaxed text-center">
          <p className="mb-4">A story of a synthetic soul,</p>
          <p className="mb-4">Made by McEwan, to make us whole.</p>
          <p className="mb-4">What are we, you and I?</p>
          <p className="text-2xl sm:text-3xl font-bold mt-6">_____ like ___</p>
        </div>

        {/* Coffee stain decoration */}
        <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full border-4 border-amber-200/50 opacity-30" />
      </motion.div>

      {/* Answer input */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
        <div className="relative w-full max-w-xs">
          {/* Scratched notepad style input */}
          <div className="absolute inset-0 bg-white/5 rounded-sm -rotate-1" />
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="the answer is..."
            className={`relative w-full bg-transparent border-b-4 border-white/30 focus:border-[#00d4aa]
                      text-center text-2xl font-[family-name:var(--font-hand)] text-white
                      py-4 outline-none transition-colors placeholder:text-white/20
                      ${error ? 'shake border-red-500' : ''}`}
          />
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="font-[family-name:var(--font-spray)] text-xl text-[#1a1a1a]
                   bg-[#00d4aa] px-8 py-3 rounded-sm transform rotate-1
                   hover:bg-[#00e4ba] transition-colors touch-highlight"
          style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}
        >
          UNLOCK
        </motion.button>
      </form>

      {/* Error feedback */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 5 }}
            exit={{ opacity: 0 }}
            className="font-[family-name:var(--font-spray)] text-3xl text-[#ff6b35]"
          >
            nah
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint after multiple attempts */}
      {getHint() && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-[family-name:var(--font-hand)] text-lg text-white/40 text-center"
        >
          {getHint()}
        </motion.p>
      )}
    </div>
  );
}

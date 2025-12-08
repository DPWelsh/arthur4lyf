'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AUDIO_ANSWER } from '@/lib/constants';

interface AudioTriggerProps {
  onComplete: () => void;
}

export default function AudioTrigger({ onComplete }: AudioTriggerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/audio/clip.mp3');
    audio.addEventListener('canplaythrough', () => setAudioLoaded(true));
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    });
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
    });
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = answer.toLowerCase().trim();

    if (input === AUDIO_ANSWER.toLowerCase()) {
      onComplete();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm px-4">
      {/* Boombox / Speaker button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className={`relative w-32 h-32 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900
                  border-4 border-zinc-600 flex items-center justify-center
                  touch-highlight ${!audioLoaded ? 'opacity-50' : ''}`}
        disabled={!audioLoaded}
      >
        {/* Speaker grille */}
        <div className="absolute inset-4 rounded-full bg-zinc-800 border-4 border-zinc-600">
          <div className="absolute inset-2 rounded-full bg-zinc-700 flex items-center justify-center">
            <motion.div
              animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-4xl"
            >
              {isPlaying ? '🔊' : '🔈'}
            </motion.div>
          </div>
        </div>

        {/* Sticker decoration */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#ff6b35] rounded-full flex items-center justify-center text-white font-bold text-xs rotate-12 sticker">
          PLAY
        </div>
      </motion.button>

      {/* Waveform visualization */}
      <div className="w-full h-12 flex items-center justify-center gap-1">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={
              isPlaying
                ? {
                    height: [8, 24 + Math.random() * 16, 8],
                  }
                : { height: 8 }
            }
            transition={{
              duration: 0.3,
              repeat: isPlaying ? Infinity : 0,
              delay: i * 0.05,
            }}
            className="w-1 bg-[#ff6b35] rounded-full"
            style={{ height: 8 }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#ff6b35]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Answer input */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
        <p className="font-[family-name:var(--font-hand)] text-lg text-white/60 text-center">
          what did you hear?
        </p>

        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="type the word..."
          className={`w-full bg-transparent border-b-4 border-white/30 focus:border-[#ff6b35]
                    text-center text-2xl font-[family-name:var(--font-hand)] text-white
                    py-3 outline-none transition-colors placeholder:text-white/20
                    ${error ? 'shake border-red-500' : ''}`}
        />

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="font-[family-name:var(--font-spray)] text-lg text-[#1a1a1a]
                   bg-[#00d4aa] px-6 py-2 rounded-sm transform -rotate-1
                   hover:bg-[#00e4ba] transition-colors touch-highlight"
        >
          CHECK
        </motion.button>
      </form>

      {/* Error feedback */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-[family-name:var(--font-hand)] text-xl text-[#ff6b35]"
        >
          listen again...
        </motion.p>
      )}
    </div>
  );
}

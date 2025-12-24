'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getProgress, setCardViewed, isAllCardsViewed } from '@/lib/progress';
import { CARDS } from '@/lib/constants';

const CARD_POSITIONS = [
  { x: '20%', y: '30%', rotate: -8 },
  { x: '50%', y: '50%', rotate: 3 },
  { x: '75%', y: '35%', rotate: -4 },
];

export default function Hub() {
  const [progress, setProgress] = useState({ viewedCards: [] as number[], unlocked: false });
  const [mounted, setMounted] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const p = getProgress();
    if (!p.unlocked) {
      router.push('/');
      return;
    }
    setProgress(p);
  }, [router]);

  const handleCardClick = (cardId: number) => {
    setSelectedCard(cardId);
  };

  const handleCloseCard = () => {
    if (selectedCard !== null) {
      setCardViewed(selectedCard);
      setProgress(getProgress());
      setSelectedCard(null);

      // Check if all cards viewed - unlock the game
      if (isAllCardsViewed()) {
        setTimeout(() => {
          router.push('/game');
        }, 500);
      }
    }
  };

  if (!mounted) return null;

  return (
    <main className="relative h-screen w-screen bg-[#1a1a1a] overflow-hidden">
      {/* Background Christmas elements */}
      <div className="absolute inset-0">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-[#c41e3a]/20 blur-xl" />
        <div className="absolute top-[60%] right-[10%] w-48 h-48 rounded-full bg-[#228b22]/15 blur-2xl" />
        <div className="absolute bottom-[20%] left-[20%] w-24 h-24 rounded-full bg-[#ffd700]/10 blur-lg" />

        {/* Christmas graffiti elements */}
        <div className="absolute top-[5%] right-[15%] text-4xl opacity-20 rotate-12">❄</div>
        <div className="absolute top-[40%] left-[8%] text-3xl opacity-15 -rotate-6 text-[#228b22]">★</div>
        <div className="absolute bottom-[10%] right-[25%] text-5xl opacity-15 rotate-45 text-[#c41e3a]">❄</div>
      </div>

      {/* String lights */}
      <div className="absolute top-0 left-0 right-0 h-6 flex justify-around items-center opacity-50 z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-[#c41e3a]' : i % 3 === 1 ? 'bg-[#228b22]' : 'bg-[#ffd700]'}`}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            style={{ boxShadow: `0 0 6px ${i % 3 === 0 ? '#c41e3a' : i % 3 === 1 ? '#228b22' : '#ffd700'}` }}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {[1, 2, 3].map((id) => (
          <motion.div
            key={id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: id * 0.1 }}
            className={`w-3 h-3 rounded-full border-2 ${
              progress.viewedCards?.includes(id)
                ? 'bg-[#228b22] border-[#228b22]'
                : 'bg-transparent border-white/30'
            }`}
          />
        ))}
      </div>

      {/* Clickable funny cards */}
      {CARD_POSITIONS.map((pos, idx) => {
        const cardId = idx + 1;
        const isViewed = progress.viewedCards?.includes(cardId);

        return (
          <motion.button
            key={cardId}
            initial={{ opacity: 0, scale: 0, rotate: pos.rotate - 20 }}
            animate={{ opacity: 1, scale: 1, rotate: pos.rotate }}
            transition={{ delay: cardId * 0.2, type: 'spring' }}
            onClick={() => handleCardClick(cardId)}
            className={`absolute touch-highlight ${isViewed ? 'opacity-60' : ''}`}
            style={{
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
            }}
          >
            <div
              className={`relative w-28 h-36 sm:w-32 sm:h-40 rounded-sm overflow-hidden
                        ${isViewed ? 'grayscale' : ''}
                        sticker cursor-pointer hover:scale-105 transition-transform`}
              style={{
                backgroundImage: `url(/images/card-${cardId}.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: isViewed ? '#444' : '#c41e3a',
              }}
            >
              {/* Placeholder if no image yet */}
              {!isViewed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">🎁</span>
                </div>
              )}

              {/* Viewed checkmark */}
              {isViewed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="text-3xl text-[#228b22]">✓</span>
                </div>
              )}
            </div>
          </motion.button>
        );
      })}

      {/* Center hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none"
      >
        <p className="font-[family-name:var(--font-hand)] text-lg text-white/30">
          {progress.viewedCards?.length === 0 && "tap to open..."}
          {progress.viewedCards?.length > 0 && progress.viewedCards?.length < 3 && "keep going..."}
          {progress.viewedCards?.length === 3 && "🍓 ready for the game!"}
        </p>
      </motion.div>

      {/* Card modal */}
      <AnimatePresence>
        {selectedCard !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={handleCloseCard}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10, opacity: 0 }}
              className="relative max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Card video or image */}
              {CARDS[selectedCard - 1]?.video ? (
                <video
                  autoPlay
                  loop
                  playsInline
                  muted={false}
                  className="w-full rounded-sm shadow-2xl"
                >
                  <source src={CARDS[selectedCard - 1].video!} type="video/mp4" />
                </video>
              ) : (
                <div
                  className="w-full aspect-square rounded-sm overflow-hidden shadow-2xl"
                  style={{
                    backgroundImage: `url(${CARDS[selectedCard - 1]?.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#c41e3a',
                  }}
                />
              )}

              {/* Close hint */}
              <p className="font-[family-name:var(--font-hand)] text-sm text-white/60 text-center mt-4">
                tap anywhere to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getProgress, setCardViewed, isAllCardsViewed, isGameCompleted } from '@/lib/progress';
import { CARDS } from '@/lib/constants';

const CARD_POSITIONS = [
  { x: '18%', y: '28%', rotate: -8 },
  { x: '40%', y: '58%', rotate: 3 },
  { x: '62%', y: '30%', rotate: -4 },
];

export default function Hub() {
  const [progress, setProgress] = useState({ viewedCards: [] as number[], unlocked: false });
  const [mounted, setMounted] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameCompleted, setGameCompletedState] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const p = getProgress();
    if (!p.unlocked) {
      router.push('/');
      return;
    }
    setProgress(p);
    setGameCompletedState(isGameCompleted());
  }, [router]);

  const handleCardClick = (cardId: number) => {
    setSelectedCard(cardId);
    setShowVideo(false);
    setSelectedAnswer(null);
  };

  const handleAnswerClick = (answerIdx: number) => {
    setSelectedAnswer(answerIdx);
    // Show video after a brief delay for the answer highlight
    setTimeout(() => {
      setShowVideo(true);
      // Play video once it's shown
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {
            // Autoplay blocked or load error - video will still be visible
          });
        }
      }, 100);
    }, 800);
  };

  const handleCloseCard = () => {
    if (selectedCard !== null) {
      setCardViewed(selectedCard);
      setProgress(getProgress());
      setSelectedCard(null);
      setShowVideo(false);
      setSelectedAnswer(null);

      // Check if all cards viewed - unlock the game (only auto-redirect first time)
      if (isAllCardsViewed() && !gameCompleted) {
        setTimeout(() => {
          router.push('/game');
        }, 500);
      }
    }
  };

  if (!mounted) return null;

  const currentCard = selectedCard ? CARDS[selectedCard - 1] : null;

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
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20">
        <div className="flex gap-2">
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
        {gameCompleted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/game')}
            className="font-[family-name:var(--font-hand)] text-2xl text-white/50 hover:text-white/80 transition-colors"
          >
            play: tassie farm fruit picking
          </motion.button>
        )}
      </div>

      {/* Clickable funny cards - BIGGER */}
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
              className={`relative w-40 h-52 sm:w-52 sm:h-64 rounded-sm overflow-hidden
                        ${isViewed ? 'grayscale' : ''}
                        sticker cursor-pointer hover:scale-105 transition-transform`}
              style={{
                backgroundImage: `url(/images/card-${cardId}.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: isViewed ? '#444' : '#c41e3a',
              }}
            >
              {/* Viewed checkmark */}
              {isViewed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="text-4xl text-[#228b22]">✓</span>
                </div>
              )}
            </div>
          </motion.button>
        );
      })}

      {/* Center hint */}
      {!gameCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none"
        >
          <p className="font-[family-name:var(--font-hand)] text-lg text-white/30">
            {progress.viewedCards?.length === 0 && "tap to open..."}
            {progress.viewedCards?.length > 0 && progress.viewedCards?.length < 3 && "keep going..."}
            {progress.viewedCards?.length === 3 && "ready for tassie farm..."}
          </p>
        </motion.div>
      )}

      {/* Card modal with question then video */}
      <AnimatePresence>
        {selectedCard !== null && currentCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={showVideo ? handleCloseCard : undefined}
          >
            {/* Hidden video preloading while question is shown */}
            <video
              ref={videoRef}
              src={currentCard.video}
              preload="auto"
              playsInline
              loop
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {!showVideo ? (
                /* Question screen */
                <motion.div
                  key="question"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0, y: -50 }}
                  className="bg-amber-50 p-6 sm:p-8 rounded-sm torn-edge max-w-sm w-full"
                >
                  <h2 className="font-[family-name:var(--font-spray)] text-2xl sm:text-3xl text-[#c41e3a] text-center mb-6">
                    {currentCard.question}
                  </h2>

                  <div className="space-y-3">
                    {currentCard.options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;

                      return (
                        <motion.button
                          key={idx}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectedAnswer === null && handleAnswerClick(idx)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-3 sm:p-4 rounded-sm text-left transition-all
                            font-[family-name:var(--font-hand)] text-lg sm:text-xl
                            ${selectedAnswer === null
                              ? 'bg-white hover:bg-[#ffd700]/20 text-zinc-700 border-2 border-zinc-200'
                              : isSelected
                                ? 'bg-[#228b22] text-white border-2 border-[#228b22]'
                                : 'bg-zinc-100 text-zinc-400 border-2 border-zinc-200'
                            }`}
                        >
                          {option}
                        </motion.button>
                      );
                    })}
                  </div>

                  {selectedAnswer !== null && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mt-4 font-[family-name:var(--font-hand)] text-lg text-[#228b22]"
                    >
                      Nailed it! 🎄
                    </motion.p>
                  )}
                </motion.div>
              ) : (
                /* Video screen */
                <motion.div
                  key="video"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="relative max-w-sm w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <video
                    autoPlay
                    loop
                    playsInline
                    muted
                    className="w-full rounded-sm shadow-2xl"
                  >
                    <source src={currentCard.video} type="video/mp4" />
                  </video>

                  <p className="font-[family-name:var(--font-hand)] text-sm text-white/60 text-center mt-4">
                    tap anywhere to close
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

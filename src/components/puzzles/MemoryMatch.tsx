'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MEMORY_CARDS } from '@/lib/constants';

interface MemoryMatchProps {
  onComplete: () => void;
}

interface Card {
  id: number;
  content: string;
  type: 'text' | 'image';
  uniqueId: number;
}

export default function MemoryMatch({ onComplete }: MemoryMatchProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Shuffle cards
    const shuffled = [...MEMORY_CARDS]
      .map((card, idx) => ({ ...card, uniqueId: idx }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  const handleCardClick = (uniqueId: number) => {
    if (checking) return;
    if (flipped.includes(uniqueId)) return;
    if (matched.includes(uniqueId)) return;
    if (flipped.length >= 2) return;

    const newFlipped = [...flipped, uniqueId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setChecking(true);
      const [first, second] = newFlipped;
      const firstCard = cards.find((c) => c.uniqueId === first);
      const secondCard = cards.find((c) => c.uniqueId === second);

      if (firstCard?.content === secondCard?.content) {
        // Match found
        setTimeout(() => {
          setMatched([...matched, first, second]);
          setFlipped([]);
          setChecking(false);

          // Check if all matched
          if (matched.length + 2 === cards.length) {
            setTimeout(onComplete, 500);
          }
        }, 800);
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
          setChecking(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
      <AnimatePresence>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.uniqueId);
          const isMatched = matched.includes(card.uniqueId);

          return (
            <motion.button
              key={card.uniqueId}
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.uniqueId)}
              className={`relative aspect-square rounded-sm overflow-hidden touch-highlight
                        ${isMatched ? 'opacity-50' : ''}`}
              style={{
                perspective: '1000px',
                transform: `rotate(${(card.uniqueId % 3) - 1}deg)`,
              }}
            >
              {/* Card back */}
              <motion.div
                animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 backface-hidden
                          bg-gradient-to-br from-[#ff6b35] to-[#ff8555]
                          border-4 border-white flex items-center justify-center
                          sticker`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="font-[family-name:var(--font-spray)] text-2xl text-white">?</span>
              </motion.div>

              {/* Card front */}
              <motion.div
                animate={{ rotateY: isFlipped || isMatched ? 0 : -180 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 backface-hidden
                          bg-white border-4 border-white
                          flex items-center justify-center p-2
                          ${isMatched ? 'bg-[#00d4aa]/20' : ''}`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                {card.type === 'text' ? (
                  <span className="font-[family-name:var(--font-hand)] text-lg text-[#1a1a1a] text-center leading-tight">
                    {card.content}
                  </span>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">img</span>
                  </div>
                )}
              </motion.div>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

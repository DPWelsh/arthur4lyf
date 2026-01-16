'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TOUR_STOPS } from '@/lib/constants';
import { getBdayProgress, setBdayStopCompleted } from '@/lib/progress';

// Shuffle array helper
function shuffleArray<T>(array: readonly T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type StopPhase = 'location' | 'pairing' | 'reveal';

interface StopState {
  phase: StopPhase;
  locationAnswer: string | null;
  pairingAnswer: string | null;
}

export default function TourPage() {
  const [mounted, setMounted] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [stopStates, setStopStates] = useState<StopState[]>(
    TOUR_STOPS.map(() => ({ phase: 'location', locationAnswer: null, pairingAnswer: null }))
  );
  const [completedStops, setCompletedStops] = useState<number[]>([]);
  const [shuffledLocationOptions, setShuffledLocationOptions] = useState<string[][]>([]);
  const [shuffledPairingOptions, setShuffledPairingOptions] = useState<string[][]>([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const progress = getBdayProgress();
    if (!progress.unlocked) {
      router.push('/');
      return;
    }
    setCompletedStops(progress.completedStops);
    // Find first incomplete stop
    const firstIncomplete = TOUR_STOPS.findIndex(stop => !progress.completedStops.includes(stop.id));
    if (firstIncomplete !== -1) {
      setCurrentStopIndex(firstIncomplete);
    }

    // Shuffle options on mount (client-side only)
    setShuffledLocationOptions(
      TOUR_STOPS.map(stop => shuffleArray(stop.locationOptions))
    );
    setShuffledPairingOptions(
      TOUR_STOPS.map(stop => {
        if ('pairingOptions' in stop && stop.pairingOptions) {
          return shuffleArray(stop.pairingOptions);
        }
        return [];
      })
    );
  }, [router]);

  const currentStop = TOUR_STOPS[currentStopIndex];
  const currentState = stopStates[currentStopIndex];
  const isChallenge = 'isChallenge' in currentStop && currentStop.isChallenge;

  const handleLocationAnswer = (answer: string) => {
    const newStates = [...stopStates];
    newStates[currentStopIndex] = {
      ...newStates[currentStopIndex],
      locationAnswer: answer,
    };
    setStopStates(newStates);

    // Check if correct
    if (answer === currentStop.location) {
      setTimeout(() => {
        const updatedStates = [...stopStates];
        updatedStates[currentStopIndex] = {
          ...updatedStates[currentStopIndex],
          locationAnswer: answer,
        };
        // If challenge stop, go straight to reveal
        if (isChallenge) {
          updatedStates[currentStopIndex].phase = 'reveal';
        } else {
          updatedStates[currentStopIndex].phase = 'pairing';
        }
        setStopStates(updatedStates);
      }, 800);
    } else {
      // Wrong answer - reset after delay
      setTimeout(() => {
        const resetStates = [...stopStates];
        resetStates[currentStopIndex] = {
          ...resetStates[currentStopIndex],
          locationAnswer: null,
        };
        setStopStates(resetStates);
      }, 1500);
    }
  };

  const handlePairingAnswer = (answer: string) => {
    const newStates = [...stopStates];
    newStates[currentStopIndex] = {
      ...newStates[currentStopIndex],
      pairingAnswer: answer,
    };
    setStopStates(newStates);

    // Check if correct
    if ('pairing' in currentStop && answer === currentStop.pairing) {
      setTimeout(() => {
        const updatedStates = [...stopStates];
        updatedStates[currentStopIndex] = {
          ...updatedStates[currentStopIndex],
          pairingAnswer: answer,
          phase: 'reveal',
        };
        setStopStates(updatedStates);
      }, 800);
    } else {
      // Wrong answer - reset after delay
      setTimeout(() => {
        const resetStates = [...stopStates];
        resetStates[currentStopIndex] = {
          ...resetStates[currentStopIndex],
          pairingAnswer: null,
        };
        setStopStates(resetStates);
      }, 1500);
    }
  };

  const handleContinue = () => {
    // Mark stop as completed
    setBdayStopCompleted(currentStop.id);
    setCompletedStops(prev => [...prev, currentStop.id]);

    // Move to next stop
    if (currentStopIndex < TOUR_STOPS.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1);
    }
  };

  if (!mounted || shuffledLocationOptions.length === 0) return null;

  const isLastStop = currentStopIndex === TOUR_STOPS.length - 1;
  const allCompleted = completedStops.length === TOUR_STOPS.length;

  return (
    <main className="relative min-h-screen w-screen bg-[#FFF8E7] overflow-hidden">
      {/* Progress dots */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {TOUR_STOPS.map((stop, idx) => (
          <motion.button
            key={stop.id}
            onClick={() => completedStops.includes(stop.id) && setCurrentStopIndex(idx)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`w-4 h-4 rounded-full border-2 transition-all ${
              completedStops.includes(stop.id)
                ? 'bg-[#6BCB77] border-[#6BCB77] cursor-pointer'
                : idx === currentStopIndex
                ? 'bg-[#FF6B6B] border-[#FF6B6B]'
                : 'bg-transparent border-[#2D2D2D]/30 cursor-default'
            }`}
          />
        ))}
      </div>

      {/* Stop number */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 font-[family-name:var(--font-spray)] text-2xl text-[#FF6B6B]"
      >
        Stop {currentStopIndex + 1}
      </motion.div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <AnimatePresence mode="wait">
          {/* Location Question Phase */}
          {currentState.phase === 'location' && (
            <motion.div
              key={`location-${currentStopIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <div className="bg-white rounded-lg p-6 sm:p-8" style={{ boxShadow: '4px 4px 0 #2D2D2D' }}>
                <h2 className="font-[family-name:var(--font-spray)] text-2xl sm:text-3xl text-[#2D2D2D] text-center mb-6">
                  {currentStop.locationQuestion}
                </h2>

                <div className="space-y-3">
                  {shuffledLocationOptions[currentStopIndex].map((option) => {
                    const isSelected = currentState.locationAnswer === option;
                    const isCorrect = option === currentStop.location;
                    const showResult = currentState.locationAnswer !== null;

                    return (
                      <motion.button
                        key={option}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => !currentState.locationAnswer && handleLocationAnswer(option)}
                        disabled={currentState.locationAnswer !== null}
                        className={`w-full p-4 rounded-lg text-left transition-all
                          font-[family-name:var(--font-hand)] text-lg sm:text-xl
                          ${!showResult
                            ? 'bg-[#FFF8E7] hover:bg-[#FFD93D]/30 text-[#2D2D2D] border-2 border-[#2D2D2D]/20'
                            : isSelected && isCorrect
                            ? 'bg-[#6BCB77] text-white border-2 border-[#6BCB77]'
                            : isSelected && !isCorrect
                            ? 'bg-[#FF6B6B] text-white border-2 border-[#FF6B6B]'
                            : 'bg-[#FFF8E7]/50 text-[#2D2D2D]/40 border-2 border-[#2D2D2D]/10'
                          }`}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>

                {currentState.locationAnswer && currentState.locationAnswer !== currentStop.location && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-4 font-[family-name:var(--font-hand)] text-lg text-[#FF6B6B]"
                  >
                    that&apos;s a bit awkward..
                  </motion.p>
                )}

                {currentState.locationAnswer === currentStop.location && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-4 font-[family-name:var(--font-hand)] text-lg text-[#6BCB77]"
                  >
                    Yes!
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* Pairing Question Phase */}
          {currentState.phase === 'pairing' && !isChallenge && 'pairingQuestion' in currentStop && (
            <motion.div
              key={`pairing-${currentStopIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <div className="bg-white rounded-lg p-6 sm:p-8" style={{ boxShadow: '4px 4px 0 #2D2D2D' }}>
                <p className="font-[family-name:var(--font-hand)] text-lg text-[#6BCB77] text-center mb-2">
                  {currentStop.location} ✓
                </p>
                <h2 className="font-[family-name:var(--font-spray)] text-2xl sm:text-3xl text-[#2D2D2D] text-center mb-6">
                  {currentStop.pairingQuestion}
                </h2>

                <div className="space-y-3">
                  {shuffledPairingOptions[currentStopIndex].map((option) => {
                    const isSelected = currentState.pairingAnswer === option;
                    const isCorrect = 'pairing' in currentStop && option === currentStop.pairing;
                    const showResult = currentState.pairingAnswer !== null;

                    return (
                      <motion.button
                        key={option}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => !currentState.pairingAnswer && handlePairingAnswer(option)}
                        disabled={currentState.pairingAnswer !== null}
                        className={`w-full p-4 rounded-lg text-left transition-all
                          font-[family-name:var(--font-hand)] text-lg sm:text-xl
                          ${!showResult
                            ? 'bg-[#FFF8E7] hover:bg-[#FFD93D]/30 text-[#2D2D2D] border-2 border-[#2D2D2D]/20'
                            : isSelected && isCorrect
                            ? 'bg-[#6BCB77] text-white border-2 border-[#6BCB77]'
                            : isSelected && !isCorrect
                            ? 'bg-[#FF6B6B] text-white border-2 border-[#FF6B6B]'
                            : 'bg-[#FFF8E7]/50 text-[#2D2D2D]/40 border-2 border-[#2D2D2D]/10'
                          }`}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>

                {currentState.pairingAnswer && 'pairing' in currentStop && currentState.pairingAnswer !== currentStop.pairing && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-4 font-[family-name:var(--font-hand)] text-lg text-[#FF6B6B]"
                  >
                    Nope, guess again!
                  </motion.p>
                )}

                {currentState.pairingAnswer && 'pairing' in currentStop && currentState.pairingAnswer === currentStop.pairing && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-4 font-[family-name:var(--font-hand)] text-lg text-[#6BCB77]"
                  >
                    Perfect!
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* Reveal Phase */}
          {currentState.phase === 'reveal' && (
            <motion.div
              key={`reveal-${currentStopIndex}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md"
            >
              <div className="bg-white rounded-lg overflow-hidden" style={{ boxShadow: '4px 4px 0 #2D2D2D' }}>
                {/* Image */}
                <div className="relative w-full h-48 sm:h-64">
                  <Image
                    src={currentStop.image}
                    alt={currentStop.location}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  {/* Location name */}
                  <h2 className="font-[family-name:var(--font-spray)] text-3xl text-[#2D2D2D] text-center mb-2">
                    {currentStop.location}
                  </h2>

                  {/* Challenge instruction or pairing */}
                  {isChallenge && 'challenge' in currentStop ? (
                    <div className="mt-4 text-center">
                      <span
                        className="inline-block bg-[#FF6B6B] text-white text-xs font-[family-name:var(--font-spray)] tracking-wider uppercase px-4 py-1.5 rounded-sm transform -rotate-1 mb-3"
                        style={{ boxShadow: '2px 2px 0 #2D2D2D' }}
                      >
                        challenge
                      </span>
                      <p className="font-[family-name:var(--font-hand)] text-lg text-[#2D2D2D] text-center">
                        {currentStop.challenge}
                      </p>
                    </div>
                  ) : 'pairing' in currentStop ? (
                    <p className="font-[family-name:var(--font-hand)] text-xl text-[#FF6B6B] text-center">
                      {'pairing' in currentStop && currentStop.pairing}
                    </p>
                  ) : null}

                  {/* Reveal message */}
                  <p className="font-[family-name:var(--font-hand)] text-lg text-[#6BCB77] text-center mt-4">
                    {currentStop.reveal}
                  </p>

                  {/* Continue button */}
                  {!completedStops.includes(currentStop.id) && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleContinue}
                      className="w-full mt-6 font-[family-name:var(--font-spray)] text-xl text-white
                               bg-[#FF6B6B] py-3 rounded-lg hover:bg-[#ff5252] transition-colors"
                      style={{ boxShadow: '3px 3px 0 #2D2D2D' }}
                    >
                      {isLastStop ? 'DONE!' : 'NEXT STOP →'}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All done message */}
        {allCompleted && currentState.phase === 'reveal' && isLastStop && completedStops.includes(currentStop.id) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="font-[family-name:var(--font-spray)] text-3xl text-[#FF6B6B]">
              Happy Birthday!
            </p>
            <p className="font-[family-name:var(--font-hand)] text-lg text-[#2D2D2D]/60 mt-2">
              Enjoy your food tour!
            </p>
            <motion.a
              href="/"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block mt-6 font-[family-name:var(--font-spray)] text-lg text-white
                       bg-[#FF6B6B] px-6 py-2 rounded-lg hover:bg-[#ff5252] transition-colors"
              style={{ boxShadow: '2px 2px 0 #2D2D2D' }}
            >
              HOME
            </motion.a>
          </motion.div>
        )}
      </div>

      {/* Home link */}
      <motion.a
        href="/"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-6 font-[family-name:var(--font-hand)] text-sm text-[#2D2D2D]/30 hover:text-[#2D2D2D]/50 transition-colors"
      >
        ← back
      </motion.a>
    </main>
  );
}

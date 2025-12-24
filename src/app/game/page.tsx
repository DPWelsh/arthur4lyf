'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getProgress, setGameCompleted, isAllCardsViewed } from '@/lib/progress';
import HomeButton from '@/components/HomeButton';

const WIN_SCORE = 10;
const FINALE_VIDEO = 'https://res.cloudinary.com/dm3cqsapn/video/upload/v1766607837/dan-on-sled_aocmh7.mp4';

export default function StrawberryGame() {
  const [mounted, setMounted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [basketX, setBasketX] = useState(50);
  const [shake, setShake] = useState<'none' | 'bad' | 'ruben'>('none');
  const [showRing, setShowRing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strawberriesRef = useRef<{id: number; x: number; y: number; bad: boolean; isRuben: boolean}[]>([]);
  const rubenImg = useRef<HTMLImageElement | null>(null);
  const basketXRef = useRef(50);
  const scoreRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const p = getProgress();
    if (!p.unlocked) {
      router.push('/');
      return;
    }
    if (!isAllCardsViewed()) {
      router.push('/hub');
      return;
    }
  }, [router]);

  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  // Game loop with canvas
  useEffect(() => {
    if (!gameStarted || gameWon) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Load Ruben image
    if (!rubenImg.current) {
      const img = new Image();
      img.src = '/images/ruben-sprite.png';
      img.onerror = () => console.warn('Failed to load Ruben sprite');
      rubenImg.current = img;
    }

    const strawberryEmoji = '🍓';

    const gameLoop = (timestamp: number) => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new strawberry - much faster spawning as score increases
      const spawnInterval = 1200 - (scoreRef.current / WIN_SCORE) * 800; // 1200ms down to 400ms
      if (timestamp - lastSpawnRef.current > spawnInterval) {
        const isRuben = Math.random() < 0.2; // 20% chance of Ruben
        strawberriesRef.current.push({
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: -5,
          bad: !isRuben && Math.random() < 0.25, // 25% chance of bad strawberry (not if Ruben)
          isRuben,
        });
        lastSpawnRef.current = timestamp;
      }

      // Update and draw strawberries - lower catch zone to match sprite
      const catchZoneY = canvas.height * 0.85;
      const catchHeight = canvas.height * 0.10;

      strawberriesRef.current = strawberriesRef.current.filter((s) => {
        // Move down - gets faster as score increases
        const speedMultiplier = 1 + (scoreRef.current / WIN_SCORE) * 1.5; // 1x to 2.5x speed
        s.y += 0.6 * speedMultiplier;

        // Check catch
        const pixelY = (s.y / 100) * canvas.height;
        const pixelX = (s.x / 100) * canvas.width;
        const basketPixelX = (basketXRef.current / 100) * canvas.width;

        if (pixelY >= catchZoneY && pixelY <= catchZoneY + catchHeight) {
          const diff = Math.abs(pixelX - basketPixelX);
          if (diff < 45) {
            if (s.isRuben) {
              // Caught Ruben! Back to 0!
              scoreRef.current = 0;
              setScore(0);
              setShake('ruben');
              setTimeout(() => setShake('none'), 600);
            } else if (s.bad) {
              // Caught a bad one! Lose 2 points
              scoreRef.current = Math.max(0, scoreRef.current - 2);
              setScore(scoreRef.current);
              setShake('bad');
              setTimeout(() => setShake('none'), 300);
            } else {
              // Caught a good one!
              scoreRef.current += 1;
              setScore(scoreRef.current);
              setShowRing(true);
              setTimeout(() => setShowRing(false), 300);

              if (scoreRef.current >= WIN_SCORE) {
                setGameWon(true);
                setGameCompleted();
              }
            }
            return false; // Remove caught item
          }
        }

        // Draw item
        if (s.isRuben && rubenImg.current && rubenImg.current.complete) {
          ctx.drawImage(rubenImg.current, pixelX - 70, pixelY - 70, 140, 140);
        } else {
          ctx.font = '40px serif';
          ctx.textAlign = 'center';
          ctx.fillText(s.bad ? '🍄' : strawberryEmoji, pixelX, pixelY);
        }

        // Remove if off screen
        return s.y < 110;
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [gameStarted, gameWon]);

  const handleMove = useCallback((clientX: number) => {
    const percentage = (clientX / window.innerWidth) * 100;
    setBasketX(Math.max(10, Math.min(90, percentage)));
  }, []);

  const handleFinish = () => {
    router.push('/finale');
  };

  if (!mounted) return null;

  const shakeClass = shake === 'ruben' ? 'animate-shake-hard' : shake === 'bad' ? 'animate-shake' : '';

  return (
    <main
      className={`relative h-screen w-screen bg-gradient-to-b from-[#87CEEB] to-[#228b22] overflow-hidden touch-none select-none ${shakeClass}`}
      onMouseMove={(e) => gameStarted && !gameWon && handleMove(e.clientX)}
      onTouchMove={(e) => gameStarted && !gameWon && handleMove(e.touches[0].clientX)}
    >
      <HomeButton />

      {/* Background elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#8B4513]/30" />
      <div className="absolute bottom-20 left-10 text-6xl pointer-events-none">🌿</div>
      <div className="absolute bottom-20 right-10 text-6xl pointer-events-none">🌿</div>
      <div className="absolute top-10 right-10 text-4xl pointer-events-none">☀️</div>

      {/* Score */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/90 px-6 py-2 rounded-full shadow-lg">
          <span className="font-[family-name:var(--font-spray)] text-2xl text-[#c41e3a]">
            🍓 {score} / {WIN_SCORE}
          </span>
        </div>
      </div>

      {/* Game canvas for strawberries */}
      {gameStarted && !gameWon && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
        />
      )}

      {/* Fruit picker (Liv) */}
      {gameStarted && !gameWon && (
        <div
          className="absolute bottom-8"
          style={{
            left: `${basketX}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Points ring effect */}
          {showRing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full border-4 border-[#ffd700] animate-ping opacity-75" />
            </div>
          )}
          <img
            src="/images/strawberry-sprite.png"
            alt="fruit picker"
            className="w-24 h-24 object-contain"
            draggable={false}
          />
        </div>
      )}

      {/* Start screen */}
      {!gameStarted && !gameWon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-30"
        >
          <div className="bg-amber-50 p-8 rounded-sm torn-edge text-center max-w-sm mx-4">
            <h2 className="font-[family-name:var(--font-spray)] text-3xl text-[#c41e3a] mb-4">
              🍓 Tassie Farm 🍓
            </h2>
            <p className="font-[family-name:var(--font-hand)] text-xl text-zinc-700 mb-6">
              Catch {WIN_SCORE} strawberries!<br />
              Move your finger to catch them
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameStarted(true)}
              className="font-[family-name:var(--font-spray)] text-xl bg-[#c41e3a] text-white px-8 py-3 rounded-sm"
            >
              START
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Win screen */}
      <AnimatePresence>
        {gameWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-30"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-amber-50 p-8 rounded-sm torn-edge text-center max-w-sm mx-4"
            >
              <h2 className="font-[family-name:var(--font-spray)] text-3xl text-[#228b22] mb-4">
                🎉 Amazing! 🎉
              </h2>
              <p className="font-[family-name:var(--font-hand)] text-xl text-zinc-700 mb-6">
                You caught all the strawberries!<br />
                One more surprise...
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleFinish}
                className="font-[family-name:var(--font-spray)] text-xl bg-[#c41e3a] text-white px-8 py-3 rounded-sm"
              >
                OPEN 🎁
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preload finale video while playing */}
      <video
        src={FINALE_VIDEO}
        preload="auto"
        muted
        playsInline
        className="hidden"
      />
    </main>
  );
}

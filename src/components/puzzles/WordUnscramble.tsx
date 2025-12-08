'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UNSCRAMBLE_PHRASE } from '@/lib/constants';

interface WordUnscrambleProps {
  onComplete: () => void;
}

interface LetterTile {
  id: string;
  letter: string;
}

function SortableTile({ id, letter }: { id: string; letter: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center
                bg-gradient-to-br from-[#ff6b35] to-[#ff8555]
                border-3 border-white rounded-sm cursor-grab active:cursor-grabbing
                font-[family-name:var(--font-spray)] text-xl sm:text-2xl text-white
                shadow-lg touch-none select-none
                ${isDragging ? 'scale-110 shadow-xl' : ''}`}
      whileTap={{ scale: 1.05 }}
    >
      {letter}
    </motion.div>
  );
}

export default function WordUnscramble({ onComplete }: WordUnscrambleProps) {
  const [tiles, setTiles] = useState<LetterTile[]>([]);
  const [hint, setHint] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  useEffect(() => {
    // Create letter tiles and shuffle
    const phrase = UNSCRAMBLE_PHRASE.replace(/\s/g, '');
    const letters = phrase.split('').map((letter, idx) => ({
      id: `tile-${idx}`,
      letter: letter.toUpperCase(),
    }));

    // Shuffle
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTiles((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Check if correct
        const currentWord = newOrder.map((t) => t.letter).join('');
        const targetWord = UNSCRAMBLE_PHRASE.replace(/\s/g, '').toUpperCase();

        if (currentWord === targetWord) {
          setTimeout(onComplete, 500);
        }

        return newOrder;
      });
    }
  };

  const handleShake = () => {
    setHint(true);
    setTimeout(() => setHint(false), 2000);
  };

  // Handle device shake for hint
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    const threshold = 15;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const deltaX = Math.abs(acc.x - lastX);
      const deltaY = Math.abs(acc.y - lastY);
      const deltaZ = Math.abs(acc.z - lastZ);

      if (deltaX + deltaY + deltaZ > threshold) {
        handleShake();
      }

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md px-4">
      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: hint ? 1 : 0.3 }}
        className="font-[family-name:var(--font-hand)] text-lg text-white/60 text-center"
      >
        {hint ? `First letter: ${UNSCRAMBLE_PHRASE[0]}` : 'shake for a hint'}
      </motion.p>

      {/* Letter tiles */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tiles.map((t) => t.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-wrap justify-center gap-2">
            {tiles.map((tile) => (
              <SortableTile key={tile.id} id={tile.id} letter={tile.letter} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Target hint */}
      <div className="flex gap-1 opacity-30">
        {UNSCRAMBLE_PHRASE.split('').map((char, idx) => (
          <div
            key={idx}
            className={`w-6 h-1 ${char === ' ' ? 'bg-transparent w-4' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}

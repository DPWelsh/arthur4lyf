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
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface JigsawProps {
  onComplete: () => void;
}

interface Piece {
  id: string;
  correctPosition: number;
  currentPosition: number;
}

function SortablePiece({
  id,
  position,
  isCorrect,
}: {
  id: string;
  position: number;
  isCorrect: boolean;
}) {
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

  // Calculate background position for the piece
  const row = Math.floor(position / 3);
  const col = position % 3;
  const bgX = col * 33.33;
  const bgY = row * 33.33;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`aspect-square cursor-grab active:cursor-grabbing touch-none select-none
                relative overflow-hidden
                ${isDragging ? 'scale-105 shadow-2xl z-50' : ''}
                ${isCorrect ? 'ring-2 ring-[#00d4aa]' : ''}`}
      whileTap={{ scale: 1.02 }}
    >
      {/* Placeholder image - replace with actual image */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/50 to-[#00d4aa]/50"
        style={{
          backgroundImage: 'url(/images/puzzle-image.jpg)',
          backgroundSize: '300% 300%',
          backgroundPosition: `${bgX}% ${bgY}%`,
        }}
      />

      {/* Torn edge effect */}
      <div className="absolute inset-0 border-2 border-white/30" />

      {/* Tape marks on some pieces */}
      {position % 3 === 1 && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-yellow-100/40 -rotate-2" />
      )}

      {/* Piece number for debugging - remove in production */}
      <div className="absolute bottom-1 right-1 text-xs text-white/50 font-mono">
        {parseInt(id.split('-')[1]) + 1}
      </div>
    </motion.div>
  );
}

export default function Jigsaw({ onComplete }: JigsawProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  useEffect(() => {
    // Create 9 pieces (3x3 grid)
    const initialPieces: Piece[] = Array.from({ length: 9 }, (_, i) => ({
      id: `piece-${i}`,
      correctPosition: i,
      currentPosition: i,
    }));

    // Shuffle positions
    const shuffled = [...initialPieces].sort(() => Math.random() - 0.5);
    shuffled.forEach((piece, idx) => {
      piece.currentPosition = idx;
    });

    setPieces(shuffled);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPieces((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Update current positions
        newOrder.forEach((piece, idx) => {
          piece.currentPosition = idx;
        });

        // Check if all pieces are in correct position
        const isComplete = newOrder.every(
          (piece) => piece.correctPosition === piece.currentPosition
        );

        if (isComplete) {
          setTimeout(onComplete, 500);
        }

        return newOrder;
      });
    }
  };

  const checkPieceCorrect = (piece: Piece) => {
    return piece.correctPosition === piece.currentPosition;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xs">
      <p className="font-[family-name:var(--font-hand)] text-lg text-white/40 text-center">
        drag to rearrange
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pieces.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-3 gap-1 w-full aspect-square bg-white/10 p-1 rounded-sm">
            {pieces.map((piece) => (
              <SortablePiece
                key={piece.id}
                id={piece.id}
                position={piece.correctPosition}
                isCorrect={checkPieceCorrect(piece)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Progress hint */}
      <p className="font-[family-name:var(--font-hand)] text-sm text-white/30">
        {pieces.filter(checkPieceCorrect).length}/9 in place
      </p>
    </div>
  );
}

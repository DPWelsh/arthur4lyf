const STORAGE_KEY = 'arthur4lyf_progress';

export interface Progress {
  unlocked: boolean;
  completedPuzzles: number[];
}

const defaultProgress: Progress = {
  unlocked: false,
  completedPuzzles: [],
};

export function getProgress(): Progress {
  if (typeof window === 'undefined') return defaultProgress;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    return JSON.parse(stored);
  } catch {
    return defaultProgress;
  }
}

export function setUnlocked(unlocked: boolean): void {
  const progress = getProgress();
  progress.unlocked = unlocked;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function completePuzzle(puzzleId: number): void {
  const progress = getProgress();
  if (!progress.completedPuzzles.includes(puzzleId)) {
    progress.completedPuzzles.push(puzzleId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

export function isPuzzleCompleted(puzzleId: number): boolean {
  return getProgress().completedPuzzles.includes(puzzleId);
}

export function getNextPuzzle(): number {
  const progress = getProgress();
  for (let i = 1; i <= 5; i++) {
    if (!progress.completedPuzzles.includes(i)) {
      return i;
    }
  }
  return 6; // All complete, go to finale
}

export function isAllComplete(): boolean {
  return getProgress().completedPuzzles.length >= 5;
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

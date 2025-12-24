const STORAGE_KEY = 'liv_christmas_progress';

export interface Progress {
  unlocked: boolean;
  viewedCards: number[];
  gameCompleted: boolean;
}

const defaultProgress: Progress = {
  unlocked: false,
  viewedCards: [],
  gameCompleted: false,
};

export function getProgress(): Progress {
  if (typeof window === 'undefined') return defaultProgress;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(stored) };
  } catch {
    return defaultProgress;
  }
}

export function setUnlocked(unlocked: boolean): void {
  const progress = getProgress();
  progress.unlocked = unlocked;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function setCardViewed(cardId: number): void {
  const progress = getProgress();
  if (!progress.viewedCards.includes(cardId)) {
    progress.viewedCards.push(cardId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

export function isAllCardsViewed(): boolean {
  return getProgress().viewedCards.length >= 3;
}

export function setGameCompleted(): void {
  const progress = getProgress();
  progress.gameCompleted = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isGameCompleted(): boolean {
  return getProgress().gameCompleted;
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

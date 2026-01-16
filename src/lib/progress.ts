const STORAGE_KEY = 'liv_christmas_progress';
const BDAY_STORAGE_KEY = 'liv_bday_progress';

export interface Progress {
  unlocked: boolean;
  viewedCards: number[];
  gameCompleted: boolean;
}

export interface BdayProgress {
  unlocked: boolean;
  completedStops: number[];
}

const defaultProgress: Progress = {
  unlocked: false,
  viewedCards: [],
  gameCompleted: false,
};

const defaultBdayProgress: BdayProgress = {
  unlocked: false,
  completedStops: [],
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

// Birthday Progress Functions
export function getBdayProgress(): BdayProgress {
  if (typeof window === 'undefined') return defaultBdayProgress;

  try {
    const stored = localStorage.getItem(BDAY_STORAGE_KEY);
    if (!stored) return defaultBdayProgress;
    return { ...defaultBdayProgress, ...JSON.parse(stored) };
  } catch {
    return defaultBdayProgress;
  }
}

export function setBdayUnlocked(unlocked: boolean): void {
  const progress = getBdayProgress();
  progress.unlocked = unlocked;
  localStorage.setItem(BDAY_STORAGE_KEY, JSON.stringify(progress));
}

export function setBdayStopCompleted(stopId: number): void {
  const progress = getBdayProgress();
  if (!progress.completedStops.includes(stopId)) {
    progress.completedStops.push(stopId);
    localStorage.setItem(BDAY_STORAGE_KEY, JSON.stringify(progress));
  }
}

export function isBdayStopCompleted(stopId: number): boolean {
  return getBdayProgress().completedStops.includes(stopId);
}

export function resetBdayProgress(): void {
  localStorage.removeItem(BDAY_STORAGE_KEY);
}

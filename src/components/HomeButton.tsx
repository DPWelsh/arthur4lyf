'use client';

import { useRouter } from 'next/navigation';

export default function HomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/hub')}
      className="fixed top-4 left-4 z-40 bg-white/20 hover:bg-white/30 backdrop-blur-sm
                 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
    >
      <span className="text-lg">🏠</span>
      <span className="font-[family-name:var(--font-hand)] text-sm text-white">home</span>
    </button>
  );
}

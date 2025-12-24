// Password
export const PASSWORD = 'yoda';
export const PASSWORD_LOWER = 'yoda';

// Puzzle content - replace placeholders with real content
export const MEMORY_CARDS = [
  { id: 1, content: 'Pole', type: 'text' as const },
  { id: 2, content: 'Pole', type: 'text' as const },
  { id: 3, content: 'Knitting', type: 'text' as const },
  { id: 4, content: 'Knitting', type: 'text' as const },
  { id: 5, content: 'Climbing', type: 'text' as const },
  { id: 6, content: 'Climbing', type: 'text' as const },
  { id: 7, content: 'Batu Karu', type: 'text' as const },
  { id: 8, content: 'Batu Karu', type: 'text' as const },
];

// Word to unscramble - replace with meaningful phrase
export const UNSCRAMBLE_PHRASE = 'HAPPY BIRTHDAY';

// Riddle answer - only she would know
export const RIDDLE_ANSWER = 'machines like me';

// Audio file path
export const AUDIO_FILE = '/audio/clip.mp3';
export const AUDIO_ANSWER = 'temple';

// Finale content
export const FINALE_MESSAGE = `Merry Christmas`;

// Card data - image, video, and questions
// Secret: ALL answers are correct - she just doesn't know it
export const CARDS = [
  {
    image: '/images/card-1.jpg',
    video: 'https://res.cloudinary.com/dm3cqsapn/video/upload/v1766606138/slay_kqcslf.mp4',
    question: 'Ideal Tassie activity?',
    options: ['Aggressive goat hugging', 'Strawberry picking with mum', 'Wholesome farm content for the gram'],
  },
  {
    image: '/images/card-2.jpg',
    video: 'https://res.cloudinary.com/dm3cqsapn/video/upload/v1766606130/deer_zfo1gv.mp4',
    question: 'Peak romance is...',
    options: ['Renting a cabin in the middle of nowhere with nothing to do', 'Being called Olivia formally', 'Sniffing powders together in a pub toilet'],
  },
  {
    image: '/images/card-3.jpg',
    video: 'https://res.cloudinary.com/dm3cqsapn/video/upload/v1766606131/santa-elf_aqj5jz.mp4',
    question: "What's the secret to sleeping well?",
    options: ['Not sleeping next to a human heat pack', 'Marshmallow dream cloud bed', 'Death to all mosquitoes'],
  },
];

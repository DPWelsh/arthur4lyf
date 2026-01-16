// Christmas Password
export const PASSWORD = 'yoda';
export const PASSWORD_LOWER = 'yoda';

// Birthday Password
export const BDAY_PASSWORD_NORMALIZED = 'luigi';
export const BDAY_HINT_1 = 'favourite pizza throwing icon';
export const BDAY_HINT_2 = "mario's brother";

// Birthday Food Tour Stops
export const TOUR_STOPS = [
  {
    id: 1,
    locationQuestion: "Where are we starting?",
    location: "Edi Garden",
    locationOptions: ["Edi Garden", "Arbory", "Garden State", "Heartattack and Vine"],
    pairingQuestion: "What are we having?",
    pairing: "Beer / Seltzer",
    pairingOptions: ["Beer / Seltzer", "Espresso Martini", "Mimosas", "Aperol Spritz"],
    image: "/images/bday/edi_gardens.webp",
    reveal: "it's a park party"
  },
  {
    id: 2,
    locationQuestion: "Next stop?",
    location: "Neighbourhood Wine",
    locationOptions: ["Neighbourhood Wine", "Bar Liberty", "Embla", "Marion"],
    pairingQuestion: "What's the pairing?",
    pairing: "Oysters & Wine",
    pairingOptions: ["Oysters & Wine", "Cheese Board", "Charcuterie", "Bruschetta"],
    image: "/images/bday/neighbourhood_wine.jpg",
    reveal: "Shit yeah!"
  },
  {
    id: 3,
    locationQuestion: "Which pub?",
    location: "Royal Oak",
    locationOptions: ["Royal Oak", "The Everleigh", "Black Pearl", "Naked for Satan"],
    isChallenge: true,
    challenge: "Walk in and ask for 'the most exquisite drink' - that's all you can say",
    image: "/images/bday/royal_oak_fitzroy.jpg",
    reveal: "Good luck!"
  },
  {
    id: 4,
    locationQuestion: "Dinner destination?",
    location: "Bistra",
    locationOptions: ["Bistra", "Tipo 00", "Scopri", "Epocha"],
    pairingQuestion: "What's for dinner?",
    pairing: "Fancy Dinner",
    pairingOptions: ["Fancy Dinner", "Pizza", "Pasta", "Burgers"],
    image: "/images/bday/BiSTRA_carlton.jpg",
    reveal: "Fancy finale!"
  }
] as const;

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
export const FINALE_MESSAGE = `UR HOT`;

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

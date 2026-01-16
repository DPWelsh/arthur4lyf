# Birthday Food Tour Landing Page

## Overview

Replace the Christmas landing with a birthday food tour experience for Olivia. Archive Christmas at `/christmas` so she can revisit.

## User Flow

```
/ (password gate)
    ↓ enters "raja ampat" or "rajaampat"
/tour (4 interactive stops)
    ↓
Stop 1: Guess location → Guess food/drink → Reveal Edi Garden photo
    ↓
Stop 2: Guess location → Guess food/drink → Reveal Neighbourhood Wine photo
    ↓
Stop 3: Guess location → Reveal challenge "ask for the most exquisite beer"
    ↓
Stop 4: Guess location → Reveal Bistra photo (finale)
```

## Password Gate

- **Password:** `raja ampat` or `rajaampat` (case insensitive, space optional)
- **Hint 1:** "where do you want to go diving in indo next..?"
- **Hint 2 (after 3 fails):** "dream diving in indo in south west papua"

## Tour Stops

### Stop 1: Edi Garden
- **Location options:** Edi Garden, Arbory, Garden State, Heartattack and Vine
- **Pairing question:** "What are we having?"
- **Pairing options:** Cider & Beer, Espresso Martini, Mimosas, Aperol Spritz
- **Correct:** Edi Garden + Cider & Beer
- **Image:** `/images/bday/edi_gardens.webp`

### Stop 2: Neighbourhood Wine
- **Location options:** Neighbourhood Wine, Bar Liberty, Embla, Marion
- **Pairing question:** "What's the pairing?"
- **Pairing options:** Oysters & Wine, Cheese Board, Charcuterie, Bruschetta
- **Correct:** Neighbourhood Wine + Oysters & Wine
- **Image:** `/images/bday/neighbourhood_wine.jpg`

### Stop 3: Royal Oak (Fitzroy)
- **Location options:** Royal Oak, The Everleigh, Black Pearl, Naked for Satan
- **No pairing question** - instead reveals challenge
- **Challenge:** "Walk in and ask for 'the most exquisite beer' - that's all you can say"
- **Image:** `/images/bday/royal_oak_fitzroy.jpg`

### Stop 4: Bistra (Carlton)
- **Location options:** Bistra, Tipo 00, Scopri, Epocha
- **Pairing question:** "What's for dinner?"
- **Pairing options:** Fancy Dinner, Pizza, Pasta, Burgers
- **Correct:** Bistra + Fancy Dinner
- **Image:** `/images/bday/BiSTRA_carlton.jpg`

## Visual Design

### Color Palette
- **Background:** Warm cream/off-white `#FFF8E7`
- **Primary:** Coral/salmon pink `#FF6B6B`
- **Accents:** Sunny yellow `#FFD93D`, mint green `#6BCB77`
- **Text:** Warm charcoal `#2D2D2D`

### Typography
- Spray paint font for "OLIVIA" (continuity from Christmas)
- Playful hand-drawn style for headings
- Clean readable font for body

### Visual Elements
- Hand-drawn style food doodles (wine glass, oyster, beer, utensils)
- Confetti or floating elements
- Scratchy/imperfect borders on cards
- Subtle paper texture background
- Bright, warm, celebratory - like a foodie birthday card

## Technical Implementation

### File Changes
1. Move `src/app/page.tsx` → `src/app/christmas/page.tsx`
2. Create new `src/app/page.tsx` (birthday password gate)
3. Create `src/app/tour/page.tsx` (interactive stops)
4. Move `photos/bday/*` → `public/images/bday/`
5. Update `src/lib/constants.ts` with birthday data

### Data Structure
```ts
export const BDAY_PASSWORD = 'rajaampat';

export const TOUR_STOPS = [
  {
    id: 1,
    locationQuestion: "Where are we starting?",
    location: "Edi Garden",
    locationOptions: ["Edi Garden", "Arbory", "Garden State", "Heartattack and Vine"],
    pairingQuestion: "What are we having?",
    pairing: "Cider & Beer",
    pairingOptions: ["Cider & Beer", "Espresso Martini", "Mimosas", "Aperol Spritz"],
    image: "/images/bday/edi_gardens.webp",
    reveal: "Cheers in the garden!"
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
    reveal: "Shuck yeah!"
  },
  {
    id: 3,
    locationQuestion: "Which pub?",
    location: "Royal Oak",
    locationOptions: ["Royal Oak", "The Everleigh", "Black Pearl", "Naked for Satan"],
    isChallenge: true,
    challenge: "Walk in and ask for 'the most exquisite beer' - that's all you can say",
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
];
```

### Progress Tracking
- localStorage key: `olivia-bday-progress`
- Track: `{ unlocked: boolean, completedStops: number[] }`

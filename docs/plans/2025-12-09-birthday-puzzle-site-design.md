# Birthday Puzzle Site Design

A scavenger hunt website for a friend's birthday. Abstract, puzzle-based, graffiti zine aesthetic.

## Concept

- **Domain**: Her graffiti tag name
- **Entry**: Password gate (special name backwards)
- **Experience**: Hub-based puzzle scavenger hunt
- **Payoff**: Real-world unlock (location/gift instructions)
- **Platform**: Mobile-optimized, deployed on Vercel

## Aesthetic: Graffiti Zine

Blend of hand-drawn zine style and street art:
- Scanned paper textures, torn edges
- Spray paint drips, tags, stencils
- Handwritten fonts, scrawled text
- Sticker-bombed elements
- Urban wall backgrounds
- Raw, unfiltered, authentic feel

## User Flow

```
Password Gate
     ↓ (correct password)
   Hub Page (puzzle 1 visible)
     ↓
  Puzzle 1 → Hub (puzzle 2 appears)
     ↓
  Puzzle 2 → Hub (puzzle 3 appears)
     ↓
  Puzzle 3 → Hub (puzzle 4 appears)
     ↓
  Puzzle 4 → Hub (puzzle 5 appears)
     ↓
  Puzzle 5 → Final Reveal
```

## The 5 Puzzles

### 1. Memory Match
- 6-8 cards in grid (3x2 or 4x2 mobile)
- Styled as polaroids/stickers on wall
- Contains photos and inside jokes
- Match all pairs to complete

### 2. Word Unscramble
- Meaningful phrase scrambled
- Draggable letter tiles (spray-painted stencil style)
- Shake phone for hint (reveals one letter)
- Arrange correctly to complete

### 3. Jigsaw
- 9-piece grid (3x3) of meaningful photo
- Pieces scattered, drag to position
- Torn edges, tape marks aesthetic
- Snap-to-grid for mobile friendliness

### 4. Audio Trigger
- Boombox/speaker button to play clip
- Voice note or song snippet
- Type what you hear to unlock
- Waveform visual during playback

### 5. The Riddle
- Handwritten riddle only she knows answer to
- Text input styled as scratched notepad
- Wrong: "nah" graffiti feedback
- Correct: tears open to finale

## Finale

- Full-screen animated reveal
- Page "opens up" like folded note
- Handwritten letter style
- Contains real-world instructions (location, gift, meetup)
- Confetti/spray burst animation
- Optional save/screenshot capability

## Technical Architecture

### Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion (animations)
- @dnd-kit (drag interactions)
- Howler.js or native audio
- Vercel deployment

### Project Structure
```
/app
  page.tsx              # Password gate
  /hub/page.tsx         # Main hub
  /puzzle/[id]/page.tsx # 5 puzzle routes
  /finale/page.tsx      # Final reveal

/components
  /puzzles/
    MemoryMatch.tsx
    WordUnscramble.tsx
    Jigsaw.tsx
    AudioTrigger.tsx
    Riddle.tsx
  /ui/
    TornPaper.tsx
    SprayText.tsx
    StickerButton.tsx
    GraffitiInput.tsx

/lib
  progress.ts           # Local storage helpers
  constants.ts          # Puzzle content config

/public
  /images/              # Photos, textures, stickers
  /audio/               # Voice notes, clips
  /fonts/               # Handwritten fonts
```

### Progress System
- Local storage based
- Tracks completed puzzles (1-5)
- Hub reads progress to show/hide elements
- No account needed

## Password Gate Details

- Full screen, centered tag name
- Single input field, minimal
- Wrong password: screen shake, paint drip animation
- Correct: page tears away revealing hub

## Hub Evolution

The homepage transforms as puzzles complete:
- Start: Chaotic collage, one hidden clickable
- After each puzzle: New elements appear, old shift
- 5 small tags as hidden progress indicator
- Full-screen, no scroll, touch-friendly

## Mobile Considerations

- Touch-friendly tap targets (min 44px)
- Drag gestures for jigsaw/unscramble
- Shake gesture for hints
- No scrolling on main views
- Portrait orientation primary

## Content Notes

**Password**: Arthur backwards → "ruhtrA"

**Aesthetic Inspiration**: Martin Parr (her favorite photographer)

**Her Interests/Hobbies**:
- Pole dancing
- Knitting
- Leather works
- Climbing
- Diving
- Rummikub at the Batu Karu cabin (memory)

**Inside Jokes/References**:
- Luigi pizza throwing meme game
- First met at temple party (use photo)
- Book: "Machines Like Me"

**Puzzle Content Ideas**:
- Memory match: Photos of her hobbies, temple party pic, Batu Karu cabin
- Word unscramble: Meaningful phrase TBD
- Jigsaw: Temple party photo or significant memory
- Audio: Voice note or significant song
- Riddle: Reference to shared memories/book/inside jokes

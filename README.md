# SVML Word-Anchored Caption Engine (Hypit Style)

> A modern, programmatic word-anchored subtitle engine inspired by [Hypit](https://github.com/hypit-ai/hypit).
> Featuring **SVML (Structured Video Markup Language)** parsing, **millisecond-accurate neural word alignment**, and **Remotion / React CSS kinetic animations**.

![Demo](demo/demo.mp4)

---

## ✨ Features

- **Word-Anchored Composition**: Subtitles, entity tags, and B-roll cues are tethered to spoken words rather than static second timestamps. If the script or voice changes, everything re-flows seamlessly.
- **SVML Syntax Support**:
  - `@entity`: Tagged keywords automatically render as glowing cyan badge pills (`#00e1ff`).
  - `<Display | Pronunciation>`: Phonetic separation (e.g. `<D | Dee>` speaks *"Dee"* while displaying *"D"*).
  - `<SPEAKER>`: Speaker-aware styles and position anchoring.
- **Kinetic Karaoke Highlights**:
  - Active spoken word highlighted in bright yellow (`#ffd23f`) with physics spring pop (`scale(1.15)`).
  - Heavy black anti-clip stroke (`-webkit-text-stroke: 8px #000; paint-order: stroke fill;`).
- **Millisecond Audio Alignment**:
  - Script included to extract neural word boundaries directly from voice models (matching WhisperX forced alignment).
- **Interactive Player**:
  - Comes with an interactive HTML5 scrub player with frame-accurate stepping and playback speed controls.

---

## 🚀 Quick Start

### 1. Requirements
- Node.js >= 18
- Python >= 3.10
- `pip install edge-tts` (for local neural speech alignment)

### 2. Extract Word Alignment
Generate speech and millisecond word boundaries:
```bash
python scripts/align_audio.py
```
This produces `public/words.json` containing exact start and end times for every word.

### 3. Run the Interactive Player
```bash
npm run serve
# Open http://localhost:8080 in your browser
```

---

## 🛠️ Code Usage in Remotion

```tsx
import { HypitCaption } from "./src/HypitCaption";

export const MyVideo = () => {
  return (
    <HypitCaption
      phrases={PHRASES}
      audioSrc="audio.wav"
      badgeColor="#00e1ff"
      activeColor="#ffd23f"
    />
  );
};
```

---

## 📜 License
MIT License.

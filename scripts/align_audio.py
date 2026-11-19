import asyncio
import json
import edge_tts

TEXT = "Ronaldo is Dee tier. Bro has more hair gel than trophies at this point. Built like a Greek god, plays like a Greek tragedy. But hey, at least he has got the most followers on Instagram."
VOICE = "en-US-ChristopherNeural"
OUT_AUDIO = "D:/video/hat-chase-handoff/public/ronaldo_aligned.mp3"
OUT_JSON = "D:/video/claude-animated-shorts/templates/bakery/ronaldo_neural_words.json"

async def main():
    communicate = edge_tts.Communicate(TEXT, VOICE, boundary="WordBoundary")
    words = []
    
    with open(OUT_AUDIO, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start_s = chunk["offset"] / 1e7
                dur_s = chunk["duration"] / 1e7
                words.append({
                    "word": chunk["text"],
                    "start": round(start_s, 3),
                    "end": round(start_s + dur_s, 3),
                })
                
    print(f"Generated audio: {OUT_AUDIO}")
    print(f"Total words: {len(words)}")
    
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(words, f, indent=2, ensure_ascii=False)
        
    for w in words[:10]:
        print(f"  {w['word']}: {w['start']}s -> {w['end']}s")
    print("...")
    for w in words[-5:]:
        print(f"  {w['word']}: {w['start']}s -> {w['end']}s")

if __name__ == "__main__":
    asyncio.run(main())

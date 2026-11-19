import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, staticFile, Audio } from "remotion";

export interface WordToken {
  word: string;
  displayWord?: string;
  start: number;
  end: number;
  isBadge?: boolean;
  badgeLabel?: string;
}

export interface PhraseSegment {
  id: string;
  speaker: string;
  svmlCode: string;
  start: number;
  end: number;
  words: WordToken[];
}

export interface HypitCaptionProps {
  phrases: PhraseSegment[];
  audioSrc?: string;
  badgeColor?: string;
  activeColor?: string;
  defaultColor?: string;
  strokeWidth?: string;
}

export const HypitCaption: React.FC<HypitCaptionProps> = ({
  phrases,
  audioSrc,
  badgeColor = "#00e1ff",
  activeColor = "#ffd23f",
  defaultColor = "#ffffff",
  strokeWidth = "8px",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const activePhrase = phrases.find(
    (p) => currentTime >= p.start && currentTime < p.end
  ) || phrases[phrases.length - 1];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
        fontFamily: "'Montserrat', 'Arial Black', sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        userSelect: "none",
      }}
    >
      {audioSrc && <Audio src={staticFile(audioSrc)} />}

      {/* Top SVML Inspector HUD */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              background: "rgba(0, 210, 255, 0.15)",
              color: "#00d2ff",
              border: "1.5px solid #00d2ff",
              padding: "6px 14px",
              borderRadius: 16,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 1,
            }}
          >
            SVML Word-Anchored Engine
          </div>
          <div
            style={{
              color: "#888888",
              fontSize: 18,
              fontFamily: "monospace",
              background: "#161616",
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid #333",
            }}
          >
            {currentTime.toFixed(2)}s (F{String(frame).padStart(3, "0")})
          </div>
        </div>

        {/* Live SVML Line */}
        <div
          style={{
            background: "#111116",
            border: "1px solid #2a2a35",
            borderRadius: 10,
            padding: "12px 16px",
            fontFamily: "Consolas, 'Courier New', monospace",
            fontSize: 18,
            color: "#e2e8f0",
          }}
        >
          <span style={{ color: "#f472b6" }}>&lt;{activePhrase.speaker}&gt;</span>{" "}
          <span style={{ color: "#38bdf8" }}>{activePhrase.svmlCode}</span>
        </div>
      </div>

      {/* Center Subtitle Container */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px 12px",
          maxWidth: "920px",
          padding: "30px 20px",
          textAlign: "center",
        }}
      >
        {activePhrase.words.map((w, i) => {
          const isActive = currentTime >= w.start && currentTime < w.end;
          const isPassed = currentTime >= w.end;

          const wordFrame = Math.max(0, Math.floor((currentTime - w.start) * fps));
          const pop = isActive
            ? spring({
                frame: wordFrame,
                fps,
                config: { damping: 10, mass: 0.4, stiffness: 220 },
              })
            : 0;
          const scale = isActive ? 1.0 + pop * 0.16 : 1.0;

          // Entity badge
          if (w.isBadge) {
            return (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: isActive ? badgeColor : "#0099cc",
                  color: "#000000",
                  padding: "8px 18px",
                  borderRadius: 12,
                  fontSize: 54,
                  fontWeight: 900,
                  transform: `scale(${scale})`,
                  boxShadow: isActive
                    ? "0 0 35px rgba(0, 225, 255, 0.9), 0 8px 20px rgba(0,0,0,0.8)"
                    : "0 4px 15px rgba(0,0,0,0.6)",
                  border: "3px solid #ffffff",
                  letterSpacing: "1px",
                }}
              >
                {w.displayWord || w.word}
              </span>
            );
          }

          // Regular word
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: isActive ? activeColor : defaultColor,
                fontSize: 58,
                fontWeight: 900,
                letterSpacing: 2,
                WebkitTextStroke: `${strokeWidth} #000000`,
                paintOrder: "stroke fill",
                textShadow: isActive
                  ? "0 0 30px rgba(255, 210, 63, 0.8), 0 8px 16px rgba(0,0,0,0.9)"
                  : "0 6px 16px rgba(0,0,0,0.9)",
                transform: `scale(${scale})`,
                opacity: isPassed ? 1.0 : (isActive ? 1.0 : 0.75),
                margin: "0 4px",
              }}
            >
              {w.displayWord || w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

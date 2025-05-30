import React, { useRef, useState, useEffect } from "react";
import BackToDashboardButton from "./BackToDashboardButton";

/**
 * FocusModePage for Study Sync.
 * Dual-timer with progress ring: 25 min study, then 5 min break, with encouragement, Start and Reset buttons.
 * Uses clean blue/white design matching the app visual style.
 */

const STUDY_DURATION = 25 * 60; // 25 min in seconds
const BREAK_DURATION = 5 * 60;  // 5 min in seconds

function formatTime(ts) {
  const mm = String(Math.floor(ts / 60)).padStart(2, '0');
  const ss = String(ts % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

// PUBLIC_INTERFACE
function ProgressRing({ radius = 72, stroke = 8, progress = 0, color = "#4F8A8B", background = "#e3eefa" }) {
  // progress in [0, 1], stroke is width of circle
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference * (1 - progress);

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke={background}
        fill="none"
        strokeWidth={stroke}
        cx={radius}
        cy={radius}
        r={normalizedRadius}
      />
      <circle
        stroke={color}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 0.5s linear"
        }}
      />
    </svg>
  );
}

const BUDDY_STUDY_MSGS = [
  "Great job, you stayed focused! 📚",
  "Well done! Study Buddy's proud of you! 🎉",
  "You rocked that session! 🚀",
  "Awesome work! Consistency is key. 🔑"
];
const BUDDY_BREAK_MSGS = [
  "Time for a well-deserved break! ☕️",
  "Stretch and recharge – you earn it! 🌤️",
  "You’ve earned this break – relax! 😌",
  "Buddy says: take 5, you genius! 🕔"
];

// PUBLIC_INTERFACE
function StudyBuddyMessage({ phase }) {
  // phase is 'study' or 'break'
  const pool = phase === "study" ? BUDDY_STUDY_MSGS : BUDDY_BREAK_MSGS;
  // pseudo-random, phase-based encouragement
  const idx = Math.floor(Math.random() * pool.length);
  return (
    <div
      style={{
        color: phase === "study" ? "#F76B8A" : "#4F8A8B",
        background: "#fafcff",
        border: `2.2px solid ${phase === "study" ? "#F76B8A33" : "#FBD46D44"}`,
        borderRadius: 15,
        padding: "16px 20px",
        marginTop: 18,
        textAlign: "center",
        fontWeight: 600,
        fontSize: "1.13em",
        boxShadow: phase === "study" ? "0 1px 8px #fde4e7bb" : "0 1px 8px #cbe4f5a7"
      }}
      aria-live="polite"
    >
      <span role="img" aria-label="Study Buddy" style={{ marginRight: 7 }}>🤖</span>
      {pool[idx]}
    </div>
  );
}

// PUBLIC_INTERFACE
function FocusModePage() {
  // 'study' | 'break' | 'done'
  const [phase, setPhase] = useState("study");
  // Timer (in seconds)
  const [remaining, setRemaining] = useState(STUDY_DURATION);
  const [running, setRunning] = useState(false);
  const [showBuddyMsg, setShowBuddyMsg] = useState(false);
  const timerRef = useRef(null);

  // Timer effect (every second tick)
  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setRemaining(prev =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);
    return () => { clearInterval(timerRef.current); };
  }, [running]);

  // On timer end
  useEffect(() => {
    if (remaining === 0 && running) {
      setRunning(false);
      setShowBuddyMsg(true);
      // When a full focus cycle completes, store progress to localStorage
      if (phase === "break") {
        // Save completion: track by date ("studysphere_focus_sessions"), array of ISO dates
        const todayISO = new Date().toISOString().slice(0, 10);
        let arr = [];
        try {
          arr = JSON.parse(localStorage.getItem("studysphere_focus_sessions")) || [];
        } catch (e) {}
        // Only add today's date if not already present (one complete session per day)
        if (!arr.includes(todayISO)) {
          arr.push(todayISO);
          localStorage.setItem("studysphere_focus_sessions", JSON.stringify(arr));
        }
        // Update streak cached as well
        // (also do this for UI "snappiness", but ProgressPage also computes it live)
        let streak = 1;
        // reverse sort dates (latest first)
        const sortedDates = [...arr].sort().reverse();
        let curr = todayISO;
        for (let i = 0; i < sortedDates.length; i++) {
          if (sortedDates[i] === curr) {
            streak++;
            curr = new Date(curr);
            curr.setDate(curr.getDate() - 1);
            curr = curr.toISOString().slice(0, 10);
          } else {
            break;
          }
        }
        localStorage.setItem(
          "studysphere_streak",
          JSON.stringify({ streak, last: todayISO })
        );
      }
      // Automatically transition after 2s, but only: study->break, break->done
      setTimeout(() => {
        if (phase === "study") {
          setPhase("break");
          setRemaining(BREAK_DURATION);
          setShowBuddyMsg(false);
          setRunning(false);
        } else if (phase === "break") {
          setPhase("done");
        }
      }, 2100);
    }
  }, [remaining, running, phase]);

  // Start click handler
  function handleStart() {
    if (phase === "done") {
      setPhase("study");
      setRemaining(STUDY_DURATION);
      setShowBuddyMsg(false);
    }
    setRunning(true);
    setShowBuddyMsg(false);
  }

  // Reset everything
  function handleReset() {
    setRunning(false);
    setPhase("study");
    setRemaining(STUDY_DURATION);
    setShowBuddyMsg(false);
  }

  // Data for UI controls
  let timerTotal =
    phase === "study" ? STUDY_DURATION : phase === "break" ? BREAK_DURATION : 0;
  let timerProgress =
    timerTotal > 0 ? (timerTotal - remaining) / timerTotal : 1;

  const headline =
    phase === "study"
      ? "Focus Mode"
      : phase === "break"
      ? "Break Time"
      : "Focus Complete!";
  const subtext =
    phase === "study"
      ? "Stay focused for 25 minutes. Study Buddy is cheering for you!"
      : phase === "break"
      ? "Relax for 5 minutes. Let your brain recharge."
      : "Great job! You finished a full focus cycle.";

  return (
    <div
      className="focus-mode-page"
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "56px 0 22px 0",
        background: "linear-gradient(120deg, #f8fafb 88%, #dffafe 100%)"
      }}
    >
      <div
        style={{
          background: "#ffffffd7",
          borderRadius: 26,
          boxShadow: "0 4px 16px 0 rgba(45,128,180,0.12)",
          maxWidth: 425,
          width: "100%",
          padding: "38px 32px 32px 32px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h2
          className="title"
          style={{
            color: "var(--primary, #4F8A8B)",
            fontWeight: 800,
            fontSize: "2.05rem",
            marginBottom: 7,
            letterSpacing: "-1.2px",
            textAlign: "center"
          }}
        >
          <span role="img" aria-label="Alarm">⏰</span> {headline}
        </h2>
        <div
          className="subtitle"
          style={{
            fontSize: "1.11rem",
            color: "#346279",
            opacity: 0.75,
            marginBottom: 19,
            textAlign: "center"
          }}
        >
          {subtext}
        </div>
        <BackToDashboardButton
          style={{
            margin: "7px 0 20px 0",
            alignSelf: "start"
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ marginBottom: 12, marginTop: 2, position: "relative" }}>
            <ProgressRing
              radius={78}
              stroke={11}
              progress={timerTotal > 0 ? 1 - remaining / timerTotal : 1}
              color={phase === "study" ? "#4F8A8B" : "#FBD46D"}
              background="#e2f4fa"
            />
            {/* time string centered */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "44%",
                width: "100%",
                textAlign: "center",
                fontSize: "2.25rem",
                fontWeight: 700,
                letterSpacing: "-1.5px",
                color: "#222"
              }}
              aria-live="polite"
            >
              {phase === "done" ? "00:00" : formatTime(remaining)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 6 }}>
            <button
              className="btn btn-large"
              style={{
                width: 120,
                background: running
                  ? "var(--primary,#4F8A8B)"
                  : "var(--accent,#F76B8A)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.17em",
                borderRadius: 14,
                border: "none",
                padding: "0.7em 0",
                letterSpacing: "-0.5px",
                boxShadow: "0 1px 7px rgba(79,138,139,0.08)",
                marginBottom: 2,
                marginTop: 2,
                outline: "none",
                cursor: "pointer",
                opacity: phase === "done" ? 0.65 : 1
              }}
              onClick={handleStart}
              disabled={phase === "done" && running}
              aria-label="Start Timer"
            >
              {running
                ? "Running"
                : phase === "done"
                ? "Restart"
                : phase === "study"
                ? "Start"
                : "Start Break"}
            </button>
            <button
              className="btn btn-large"
              style={{
                width: 92,
                background: "#e9eff1",
                color: "#4F8A8B",
                fontWeight: 700,
                fontSize: "1.06em",
                borderRadius: 15,
                border: "none",
                marginBottom: 2,
                outline: "none",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
              }}
              onClick={handleReset}
              aria-label="Reset Timer"
            >
              Reset
            </button>
          </div>
          {/* Encouragement message at end of phase */}
          {showBuddyMsg || phase === "done" ? (
            <StudyBuddyMessage phase={phase === "study" ? "study" : "break"} />
          ) : null}
        </div>
        {/* Optional: Cycle display progress */}
        <div
          style={{
            marginTop: 28,
            color: "#ADBAC7",
            fontSize: "1.07em",
            opacity: 0.58,
            textAlign: "center",
            fontWeight: 400
          }}
        >
          {phase === "study" && (
            <span>
              <span style={{ color: "#4F8A8B" }}>Study</span> <strong>25:00</strong>
              <span style={{ margin: "0 8px" }}>→</span>
              <span style={{ color: "#FBD46D" }}>Break</span> <strong>5:00</strong>
            </span>
          )}
          {phase === "break" && (
            <span>
              <span style={{ color: "#FBD46D" }}>Break</span> <strong>5:00</strong>
            </span>
          )}
          {phase === "done" && (
            <span>
              One complete focus cycle! <span role="img" aria-label="done">✅</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default FocusModePage;

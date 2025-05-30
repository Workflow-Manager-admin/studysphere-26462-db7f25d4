import React, { useEffect, useState } from "react";
import BackToDashboardButton from "./BackToDashboardButton";

/**
 * ProgressPage for Study Sync
 * Shows number of completed study sessions (from Focus Mode, stored in localStorage),
 * Daily streak (increment if Focus Mode completed today, resets if missed, fire emoji 🔥),
 * Quiz accuracy (%) based on stored Quiz Battle results (localStorage).
 * Modern, soft blue/white design, clear, friendly layout.
 */

const SESSION_KEY = "studysphere_focus_sessions"; // array of ISO dates (YYYY-MM-DD)
const STREAK_KEY = "studysphere_streak";         // {streak: n, last: YYYY-MM-DD}
const QUIZ_KEY = "studysphere_quiz_record";      // {correct: n, total: m}

/**
 * Calculate streak based on an array of completion dates (['2024-04-10',...])
 */
function calculateStreak(datesArr) {
  if (!datesArr || datesArr.length === 0) return 0;

  // Parse all dates, sort descending
  const allDays = Array.from(new Set(datesArr.map(DateOnlyISO))).sort().reverse();

  // "Today" is localized to user browser
  const today = DateOnlyISO(new Date());

  let streak = 0;
  let prevDay = today;
  // Walk backward, counting contiguous days from today
  for (let i = 0; i < allDays.length; ++i) {
    if (allDays[i] === prevDay) {
      streak++;
      prevDay = DateOnlyISO(dateMinus1day(prevDay));
    } else if (i === 0 && DateOnlyISO(daysAgo(0)) !== allDays[0]) {
      // Not completed today
      break;
    } else if (allDays[i] === DateOnlyISO(dateMinus1day(prevDay))) {
      streak++;
      prevDay = DateOnlyISO(dateMinus1day(prevDay));
    } else {
      break;
    }
  }
  return streak;
}

function DateOnlyISO(d) {
  return (typeof d === "string"
    ? new Date(d)
    : d
  )
    .toISOString()
    .slice(0, 10);
}
function dateMinus1day(isostr) {
  const date = typeof isostr === "string" ? new Date(isostr) : isostr; // may already be Date
  date.setDate(date.getDate() - 1);
  return date;
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function ProgressCard({ icon, label, value, accent, sublabel }) {
  return (
    <div
      style={{
        background: "#f8fafb",
        borderRadius: 20,
        boxShadow: "0 3px 10px 0 rgba(79,138,139,0.09)",
        padding: "32px 20px 22px 20px",
        minWidth: 190,
        flex: "1 1 210px",
        margin: "12px 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: "2.55rem",
          marginBottom: 11,
          color: accent,
          filter: "drop-shadow(0 1px 3px #d3ecf5aa)"
        }}
        aria-label={label}
      >
        {icon}
      </div>
      <div style={{
        color: "var(--kavia-dark, #1A1A1A)",
        fontWeight: 800,
        fontSize: "2.18rem",
        marginBottom: sublabel ? 0 : 2,
        textAlign: "center"
      }}>{value}</div>
      {sublabel && <div
        style={{
          color: "#889fab",
          fontSize: "1.04em",
          marginBottom: 1,
          textAlign: "center",
          marginTop: 3,
          fontWeight: 400
        }}
      >{sublabel}</div>}
      <div style={{
        fontWeight: 600,
        color: accent,
        marginTop: 7,
        fontSize: "1.09em",
        textAlign: "center"
      }}>{label}</div>
    </div>
  );
}

// PUBLIC_INTERFACE
function ProgressPage() {
  const [sessions, setSessions] = useState([]); // array of completion dates
  const [streak, setStreak] = useState(0);
  const [quizStats, setQuizStats] = useState({ correct: 0, total: 0 });

  // Load all progress data from localStorage on mount
  useEffect(() => {
    // Sessions/completions
    try {
      const sessionArr = JSON.parse(localStorage.getItem(SESSION_KEY)) || [];
      setSessions(Array.isArray(sessionArr) ? sessionArr : []);
    } catch (e) {
      setSessions([]);
    }

    // Quiz accuracy
    try {
      const record = JSON.parse(localStorage.getItem(QUIZ_KEY)) || { correct: 0, total: 0 };
      setQuizStats(record);
    } catch (e) {
      setQuizStats({ correct: 0, total: 0 });
    }
  }, []);

  // Compute streak each time sessions change
  useEffect(() => {
    setStreak(calculateStreak(sessions));
  }, [sessions]);

  const accuracy =
    quizStats.total > 0
      ? Math.round((quizStats.correct / quizStats.total) * 100)
      : 0;

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "58px 0 24px 0",
        background: "linear-gradient(123deg, #e4f1fb 88%, #F8FAFB 99%)"
      }}
      className="progress-page"
    >
      <div style={{
        background: "#fff",
        borderRadius: 30,
        boxShadow: "0 7px 22px 0 rgba(79,138,139,0.11)",
        maxWidth: 470,
        width: "100%",
        padding: "38px 34px 31px 34px",
        margin: "auto",
        marginTop: 10,
        marginBottom: 28,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h2
          className="title"
          style={{
            color: "#4F8A8B",
            fontWeight: 900,
            fontSize: "2.14rem",
            marginBottom: 3,
            letterSpacing: "-1.2px",
            textAlign: "center"
          }}
        >
          Your Progress <span role="img" aria-label="Sparkles">🌟</span>
        </h2>
        <div
          className="subtitle"
          style={{
            fontSize: "1.13rem",
            color: "#346279",
            opacity: 0.74,
            marginBottom: 10,
            textAlign: "center"
          }}
        >
          Track your study sessions, streak, and quiz skills!
        </div>
        <BackToDashboardButton style={{ margin: "9px 0 22px 0", alignSelf: "start" }} />

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
            marginTop: 9
          }}
        >
          <ProgressCard
            icon="🎯"
            label="Sessions Completed"
            value={sessions.length}
            accent="#4F8A8B"
            sublabel={sessions.length > 0 ? "Great consistency!" : "Start Focus Mode today"}
          />
          <ProgressCard
            icon="🔥"
            label="Daily Streak"
            value={streak}
            accent="#F76B8A"
            sublabel={streak > 0 ? `You’re on fire!` : "Complete a session to start streak"}
          />
          <ProgressCard
            icon="🤺"
            label="Quiz Accuracy"
            value={quizStats.total === 0 ? "- %" : `${accuracy}%`}
            accent="#FBD46D"
            sublabel={quizStats.total > 0 ? `${quizStats.correct} / ${quizStats.total} correct` : "Try Quiz Battle!"}
          />
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;

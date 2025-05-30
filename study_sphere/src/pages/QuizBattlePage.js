import React, { useState } from "react";
import BackToDashboardButton from "./BackToDashboardButton";

// Sample MCQs (could be randomized, simple for prototype/demo)
const QUESTIONS = [
  {
    q: "What is the powerhouse of the cell?",
    choices: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
    answer: 2,
  },
  {
    q: "Which language does React use?",
    choices: ["C++", "Java", "JavaScript", "Python"],
    answer: 2,
  },
  {
    q: "What is 7 x 6?",
    choices: ["36", "42", "49", "56"],
    answer: 1,
  },
];

// PUBLIC_INTERFACE
function QuizBattlePage() {
  /**
   * Quiz Battle: 3 MCQs, collect answers, show user score and a dummy buddy score after submission,
   * offer a Try Again button, styled playfully and responsively.
   */
  const [selected, setSelected] = useState(Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [buddyScore, setBuddyScore] = useState(null);

  const handleChoice = (qIdx, cIdx) => {
    if (!submitted) {
      setSelected((prev) =>
        prev.map((val, i) => (i === qIdx ? cIdx : val))
      );
    }
  };

  // Simulate buddy score: always random between (userScore - 1) and (userScore + 1), but stay in bounds [0,3]
  const simulateBuddyScore = (userScore) => {
    const min = Math.max(0, userScore - 1);
    const max = Math.min(QUESTIONS.length, userScore + 1);
    // Deterministic for demo: userScore==3 => 2, 2=>3, 1=>0, 0=>1
    if (userScore === 3) return 2;
    if (userScore === 2) return 3;
    if (userScore === 1) return 0;
    return 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let userScore = 0;
    for (let i = 0; i < QUESTIONS.length; ++i) {
      if (selected[i] === QUESTIONS[i].answer) userScore++;
    }
    setScore(userScore);
    setBuddyScore(simulateBuddyScore(userScore));
    setSubmitted(true);

    // Store quiz attempt in localStorage for Progress tracking
    // Format: { correct: int, total: int }
    try {
      const prev = JSON.parse(localStorage.getItem("studysphere_quiz_record")) || { correct: 0, total: 0 };
      const updated = {
        correct: prev.correct + userScore,
        total: prev.total + QUESTIONS.length,
      };
      localStorage.setItem("studysphere_quiz_record", JSON.stringify(updated));
    } catch (e) {/* ignore */}
  };

  // Try Again resets quiz state
  const handleTryAgain = () => {
    setSelected(Array(QUESTIONS.length).fill(null));
    setSubmitted(false);
    setScore(0);
    setBuddyScore(null);
  };

  return (
    <div
      className="quiz-battle-wrapper"
      style={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 0 15px 0",
        background: "linear-gradient(120deg,#f8fafb 90%, #F76B8A18 100%)",
      }}
    >
      <div
        className="quiz-card"
        style={{
          background: "#fff",
          borderRadius: 23,
          maxWidth: 430,
          width: "100%",
          padding: "38px 26px 32px 26px",
          margin: "auto",
          boxShadow: "0 4px 16px 0 rgba(80,70,60,0.13)",
        }}
      >
        <h2
          className="quiz-title"
          style={{
            color: "#4F8A8B",
            fontWeight: 700,
            fontSize: "2rem",
            marginBottom: 8,
            letterSpacing: "-0.5px",
          }}
        >
          Quiz Battle <span role="img" aria-label="swords">🤺</span>
        </h2>
        <div
          className="quiz-desc"
          style={{
            color: "#F76B8A",
            marginBottom: 18,
            fontSize: "1.09em",
            opacity: 0.84,
          }}
        >
          Answer all 3 questions and see who wins, you or your Study Buddy!
        </div>
        <BackToDashboardButton style={{ margin: "8px 0 21px 0", alignSelf: "start" }} />
        <form onSubmit={handleSubmit} autoComplete="off">
          <ol style={{ paddingLeft: 0, margin: "0 0 8px 0" }}>
            {QUESTIONS.map((q, qIdx) => (
              <li
                key={qIdx}
                style={{
                  marginBottom: 20,
                  background: "#f8fafb",
                  borderRadius: 14,
                  padding: "11px 10px 13px 13px",
                  boxShadow: "0 1px 4px 0 rgba(80,70,60,0.06)",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: "#222",
                    marginBottom: 8,
                    fontSize: "1.07em",
                  }}
                >
                  {q.q}
                </div>
                <div>
                  {q.choices.map((choice, cIdx) => (
                    <label
                      key={cIdx}
                      style={{
                        display: "block",
                        background:
                          submitted && cIdx === q.answer
                            ? "#FBD46D"
                            : submitted && selected[qIdx] === cIdx
                            ? "#F76B8A33"
                            : "#fff",
                        color:
                          submitted && cIdx === q.answer
                            ? "#222"
                            : submitted && selected[qIdx] === cIdx
                            ? "#F76B8A"
                            : "#4F8A8B",
                        borderRadius: 8,
                        padding: "6px 13px 6px 9px",
                        marginBottom: 2,
                        fontWeight: 500,
                        cursor: submitted ? "not-allowed" : "pointer",
                        border:
                          selected[qIdx] === cIdx
                            ? "1.5px solid #4F8A8B"
                            : "1px solid #e2e9f0",
                        transition: "all 0.18s",
                        boxShadow:
                          submitted && cIdx === q.answer
                            ? "0 0 4px 1px #ffe17c44"
                            : undefined,
                        opacity: submitted ? (cIdx === q.answer || selected[qIdx] === cIdx ? 1 : 0.68) : 1,
                      }}
                    >
                      <input
                        type="radio"
                        name={`q${qIdx}`}
                        checked={selected[qIdx] === cIdx}
                        onChange={() => handleChoice(qIdx, cIdx)}
                        disabled={submitted}
                        style={{
                          accentColor: "#4F8A8B",
                          marginRight: 9,
                        }}
                        required={selected[qIdx] == null}
                      />
                      {choice}
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          {!submitted ? (
            <button
              className="btn"
              type="submit"
              style={{
                width: "100%",
                background: "#4F8A8B",
                color: "#fff",
                marginTop: 10,
                fontWeight: 700,
                fontSize: "1.13em",
                borderRadius: 10,
                border: "none",
                padding: "0.7em 0",
                letterSpacing: "0.01em",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
              }}
              disabled={selected.includes(null)}
            >
              Submit Answers
            </button>
          ) : (
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <div
                className="score-box"
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  gap: 18,
                  marginBottom: 9,
                }}
              >
                <div
                  style={{
                    background: "#F76B8A22",
                    padding: "13px 21px",
                    borderRadius: "15px",
                    color: "#4F8A8B",
                    fontWeight: 700,
                    fontSize: "1.06em",
                    border: "2px solid #F76B8A",
                  }}
                >
                  You:{" "}
                  <span style={{ fontSize: "1.35em", color: "#F76B8A" }}>{score}</span> / {QUESTIONS.length}
                </div>
                <div
                  style={{
                    background: "#FBD46D33",
                    padding: "13px 17px",
                    borderRadius: "15px",
                    color: "#957717",
                    fontWeight: 700,
                    fontSize: "1.05em",
                    border: "2px solid #FBD46D",
                  }}
                >
                  Buddy:{" "}
                  <span style={{ fontSize: "1.32em", color: "#BCA218" }}>
                    {buddyScore}
                  </span>{" "}
                  / {QUESTIONS.length}
                </div>
              </div>
              <div
                style={{
                  fontWeight: "600",
                  color: score === buddyScore
                    ? "#4F8A8B"
                    : score > buddyScore
                    ? "#38c464"
                    : "#F76B8A",
                  marginBottom: 11,
                  fontSize: "1.1em"
                }}
              >
                {score === buddyScore
                  ? "It's a tie! Study Buddies think alike 😃"
                  : score > buddyScore
                  ? "Victory! You outsmarted your Buddy 🏆"
                  : "Buddy wins this round. Try again!"}
              </div>
              <button
                type="button"
                className="btn"
                style={{
                  width: "88%",
                  background: "#FBD46D",
                  color: "#343d3d",
                  fontWeight: 700,
                  fontSize: "1.12em",
                  borderRadius: 10,
                  border: "none",
                  marginTop: 7,
                  padding: "0.6em",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                }}
                onClick={handleTryAgain}
              >
                Try Again
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default QuizBattlePage;

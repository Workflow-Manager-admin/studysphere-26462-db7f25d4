import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

/**
 * JoinPage - Modern, student-focused entry screen for Study Sync.
 *
 * Features:
 *   - Prominent "Study Sync" title
 *   - Name input (with validation)
 *   - "Join Study Room" button
 *   - Soft blue/white modern design
 *   - On join: stores name in context and navigates to dashboard
 */

// PUBLIC_INTERFACE
function JoinPage() {
  // State for input and error
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const { setUsername } = useUser();
  const navigate = useNavigate();

  // Handle input as user types
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (error) setError("");
  };

  // Validate name field for basic student-friendly guidance
  const validateUsername = (name) => {
    if (!name.trim()) return "Please enter your name.";
    if (name.length > 20) return "Name must be at most 20 characters.";
    return "";
  };

  // On submit, store and navigate if valid
  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = validateUsername(input);
    if (msg) {
      setError(msg);
      return;
    }
    setUsername(input.trim());
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(120deg, #f8fafb 83%, #e4f1fb 100%)",
        padding: "16px 0",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255, 0.82)",
          borderRadius: 22,
          boxShadow: "0 6px 24px 0 rgba(80,140,180,0.11)",
          maxWidth: 370,
          width: "100%",
          padding: "38px 22px 32px 22px",
          margin: "36px 0",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ marginBottom: 30 }}>
          {/* "Study Sync" Title */}
          <h1
            className="title"
            style={{
              color: "var(--primary, #4F8A8B)",
              fontWeight: 900,
              fontSize: "2.5rem",
              letterSpacing: "-1.4px",
              margin: "0 0 5px 0",
              fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            }}
          >
            Study Sync
          </h1>
          <div
            className="subtitle"
            style={{
              fontSize: "1.18rem",
              color: "#4F8A8B",
              opacity: 0.73,
              marginBottom: 3,
              fontWeight: 400,
            }}
          >
            Welcome! Enter your name to begin
          </div>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off" style={{ width: "100%" }}>
          <div style={{ marginBottom: 23 }}>
            <input
              type="text"
              placeholder="Your Name"
              value={input}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "13px 15px",
                borderRadius: 13,
                border: "1.5px solid var(--border-color, #e5e6ef)",
                fontSize: "1rem",
                fontFamily: "inherit",
                marginBottom: 5,
                outline: "none",
                background: "#f8fafb",
                color: "#212226",
                boxSizing: "border-box",
                transition: "border 0.17s",
                textAlign: "center",
                boxShadow: error ? "0 0 0 1.5px #F76B8A" : "none",
              }}
              maxLength={24}
              aria-label="Your Name"
              autoFocus
            />
            {error && (
              <div
                style={{
                  color: "#F76B8A",
                  fontSize: "0.98em",
                  marginTop: 2,
                  minHeight: 22,
                }}
              >
                {error}
              </div>
            )}
          </div>
          <button
            className="btn btn-large"
            type="submit"
            style={{
              width: "100%",
              background: "var(--primary, #4F8A8B)",
              color: "#fff",
              borderRadius: 99,
              fontWeight: 700,
              fontSize: "1.15em",
              padding: "0.78em 0",
              boxShadow: "0 1px 9px rgba(79,138,139,0.08)",
              letterSpacing: "-0.5px",
              border: "none",
              marginBottom: 4,
              marginTop: 2,
              outline: "none",
              cursor: "pointer",
              transition: "background 0.15s, color 0.12s, transform 0.11s",
            }}
            aria-label="Join Study Room"
          >
            Join Study Room &rarr;
          </button>
        </form>
        <div
          className="description"
          style={{
            color: "#7ac0d5",
            fontSize: "1.03em",
            marginTop: 18,
            opacity: 0.57,
            fontWeight: 400,
          }}
        >
          Start syncing your study with others – fast, friendly, and fun!
        </div>
      </div>
    </div>
  );
}

export default JoinPage;

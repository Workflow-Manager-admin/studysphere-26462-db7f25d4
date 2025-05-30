import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

// PUBLIC_INTERFACE
function JoinPage() {
  /**
   * The user join page where user can enter their name and start a session.
   * Features:
   *  - Username entry form
   *  - Basic validation (non-empty, max len 20)
   *  - On submit, sets username in context and redirects to /dashboard
   */
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const { setUsername } = useUser();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (error) setError("");
  };

  const validateUsername = (name) => {
    if (!name.trim()) return "Please enter your name.";
    if (name.length > 20) return "Name must be at most 20 characters.";
    return "";
  };

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
    <div style={{
      maxWidth: 360,
      margin: "48px auto",
      background: "rgba(255,255,255,0.025)",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      padding: 32,
      textAlign: "center"
    }}>
      <h2 style={{ marginBottom: 12 }}>Join StudySphere</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div style={{ marginBottom: 18 }}>
          <input
            type="text"
            placeholder="Enter your name"
            value={input}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: "1rem",
              marginBottom: 6
            }}
            maxLength={24}
            aria-label="Your Name"
            autoFocus
          />
          {error &&
            <div style={{ color: "#F76B8A", fontSize: "0.95em" }}>{error}</div>
          }
        </div>
        <button className="btn btn-large" type="submit" style={{ width: "100%" }}>
          Enter &rarr;
        </button>
      </form>
    </div>
  );
}

export default JoinPage;

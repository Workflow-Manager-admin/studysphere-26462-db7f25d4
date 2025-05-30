import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

/**
 * Study Sync Dashboard page
 * Personalized welcome and large nav buttons for all features (with emojis, accessible, responsive, modern layout).
 */

// PUBLIC_INTERFACE
function DashboardPage() {
  const { username } = useUser();
  const navigate = useNavigate();

  // Emojis: 📋 (tasks), 🤺 (quiz), 💬 (chat)
  const features = [
    {
      label: "Shared Tasks",
      path: "/tasks",
      emoji: "📋",
      accent: "#4F8A8B" // Primary
    },
    {
      label: "Quiz Battle",
      path: "/quiz",
      emoji: "🤺",
      accent: "#F76B8A" // Accent
    },
    {
      label: "Study Chat",
      path: "/chat",
      emoji: "💬",
      accent: "#FBD46D" // Secondary
    }
  ];

  return (
    <div
      className="dashboard"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "70vh",
        justifyContent: "center",
        padding: "24px 0"
      }}
    >
      <h2 style={{
        fontSize: "2.3rem",
        marginBottom: 6,
        fontWeight: 600
      }}>
        Welcome{username ? `, ${username}` : ""}! 🎉
      </h2>
      <p style={{
        fontSize: "1.15rem",
        color: "var(--text-secondary)",
        marginBottom: 36,
        textAlign: "center"
      }}>
        Your study hub is ready — jump into any activity!
      </p>

      <div
        style={{
          display: "flex",
          gap: 28,
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          maxWidth: 560,
          marginBottom: 24
        }}
      >
        {features.map(feat => (
          <button
            key={feat.path}
            className="dashboard-btn"
            style={{
              background: feat.accent,
              color: feat.accent === "#FBD46D" ? "#222" : "#fff",
              border: "none",
              borderRadius: 18,
              minWidth: 134,
              minHeight: 104,
              fontWeight: 600,
              fontSize: "1.27rem",
              margin: "8px 0",
              cursor: "pointer",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              outline: "none",
              transition: "transform 0.12s",
              flex: "1 1 140px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => navigate(feat.path)}
            tabIndex={0}
            aria-label={feat.label}
          >
            <span style={{
              fontSize: "2.3rem",
              marginBottom: 6,
              display: "block"
            }}>
              {feat.emoji}
            </span>
            {feat.label}
          </button>
        ))}
      </div>

      <div style={{
        marginTop: 16,
        color: "var(--text-secondary)",
        fontSize: "0.98rem",
        textAlign: "center",
        opacity: 0.7,
        maxWidth: 320
      }}>
        <span style={{fontSize: "1.1em"}}>Tip:</span> You can always come back here to switch activities!
      </div>
    </div>
  );
}

export default DashboardPage;

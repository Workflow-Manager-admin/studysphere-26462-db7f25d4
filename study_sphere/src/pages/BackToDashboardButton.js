import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * BackToDashboardButton component
 * Renders a styled, rounded button that navigates to the Dashboard.
 * To be used on all feature pages for consistent navigation.
 */

// PUBLIC_INTERFACE
function BackToDashboardButton({ style = {}, className = "" }) {
  const navigate = useNavigate();
  return (
    <button
      className={`btn back-to-dashboard-btn ${className}`}
      style={{
        background: "var(--secondary, #FBD46D)",
        color: "#2b2b2b",
        borderRadius: 22,
        fontWeight: 700,
        boxShadow: "0 1px 4px rgba(250,213,109,0.13)",
        padding: "0.7em 1.9em",
        fontSize: "1.08em",
        margin: "24px 0 0 0",
        border: "none",
        transition: "background 0.15s, color 0.13s, transform 0.10s",
        outline: "none",
        ...style,
      }}
      onClick={() => navigate("/dashboard")}
      tabIndex={0}
      aria-label="Back to Dashboard"
      type="button"
    >
      ⬅️ Back to Dashboard
    </button>
  );
}

export default BackToDashboardButton;

import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../UserContext";
import BackToDashboardButton from "./BackToDashboardButton";

/**
 * StudyChatPage: Provides a playful, responsive chat between user and a *real-time* Study Buddy powered by OpenAI GPT-4.1.
 */

/**
 * Helper to get the OpenAI API key:
 * - Try window.OPENAI_API_KEY first (for secure deployment).
 * - Fall back to process.env.REACT_APP_OPENAI_API_KEY for local dev.
 *
 * Ensure .env file uses: REACT_APP_OPENAI_API_KEY=your_key (and never commits to repo).
 */
function getOpenAIApiKey() {
  // Try window-injected (secure, deployment scenarios)
  if (typeof window !== "undefined" && window.OPENAI_API_KEY)
    return window.OPENAI_API_KEY;
  // Try from env (create-react-app will inline during build)
  if (
    typeof process !== "undefined" &&
    process.env.REACT_APP_OPENAI_API_KEY
  )
    return process.env.REACT_APP_OPENAI_API_KEY;
  return null;
}

// System prompt for Study Buddy persona
const SYSTEM_PROMPT = `You are Study Buddy, an enthusiastic, supportive peer who helps students stay motivated. Respond to user messages with encouragement, useful study insights, and playful tone. Keep it positive and brief (1-3 sentences), sometimes use emojis. Never break character: act as a student study buddy, not an AI or assistant.`;

const GPT_MODEL = "gpt-4-1106-preview"; // GPT-4.1

// PUBLIC_INTERFACE
function StudyChatPage() {
  /**
   * Chat UI: on every user message, forwards history to OpenAI and gets a real-time Study Buddy reply.
   * Shows loading indicators, disables input while waiting, and handles errors gracefully.
   */
  const { username } = useUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      author: "buddy",
      text: `Hi${username ? ` ${username}` : ""}! 👋 I'm Study Buddy. Let's chat and stay motivated! 🎉`
    }
  ]);
  const [pendingBuddy, setPendingBuddy] = useState(false);
  const [error, setError] = useState("");
  const chatBottomRef = useRef(null);

  // Scroll to bottom on new message (including while loading)
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, pendingBuddy, error]);

  // Async function to call OpenAI completion
  async function fetchBuddyReply(chatHistory) {
    const apiKey = getOpenAIApiKey();
    if (!apiKey) {
      throw new Error(
        "OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in your .env file (see README for details)."
      );
    }

    const contentMessages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...chatHistory.map((m) => ({
        role: m.author === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    const payload = {
      model: GPT_MODEL,
      messages: contentMessages,
      max_tokens: 110,
      temperature: 0.85,
      stop: null,
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const more = await res.json().catch(() => ({}));
      let msg = "OpenAI API error.";
      if (more && more.error && more.error.message) {
        msg = more.error.message;
      }
      throw new Error(msg);
    }
    const data = await res.json();
    // Defensive: handle different OpenAI response shapes
    const reply =
      (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content)
        ? data.choices[0].message.content.trim()
        : "Sorry, I had trouble replying. Try again!";
    return reply;
  }

  // Handle sending user message and getting GPT reply
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || pendingBuddy) return;
    setMessages(prev => [
      ...prev,
      { author: "user", text: input.trim() }
    ]);
    setInput("");
    setPendingBuddy(true);
    setError("");

    // Get full latest chat for context (up to last 7 exchanges or fewer)
    let fullHistory;
    setMessages((prevMsgs) => {
      fullHistory = [...prevMsgs, { author: "user", text: input.trim() }];
      return fullHistory;
    });

    try {
      // Wait a bit for realism even before fetch
      await new Promise((res) => setTimeout(res, 300 + Math.random() * 250));
      const reply = await fetchBuddyReply(fullHistory.slice(-7));
      setMessages((prev) => [
        ...prev,
        { author: "buddy", text: reply }
      ]);
    } catch (err) {
      setError(typeof err === "string" ? err : err.message || "Unknown error");
      setMessages((prev) => [
        ...prev,
        { author: "buddy", text: "Oops, I ran into an error and can't reply now. Please try again later!" }
      ]);
    } finally {
      setPendingBuddy(false);
    }
  };

  // Enter key submits (unless pending)
  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey && !pendingBuddy) {
      handleSend(e);
    }
  };

  return (
    <div
      className="chat-wrapper"
      style={{
        minHeight: "72vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "34px 0 10px 0",
        background: "linear-gradient(110deg, #f8fafbaa 88%, #FBD46D22 100%)",
      }}
    >
      <div
        className="chat-card"
        style={{
          maxWidth: 450,
          width: "100%",
          margin: "auto",
          background: "#fff",
          borderRadius: 25,
          boxShadow: "0 4px 17px 0 rgba(80,70,60,0.12)",
          display: "flex",
          flexDirection: "column",
          minHeight: 440,
          height: "68vh",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "19px 22px 8px 22px",
            background: "linear-gradient(96deg,#FBD46D22 70%, #fff 97%)",
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            fontWeight: 700,
            fontSize: "1.4rem",
            color: "#4F8A8B",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span role="img" aria-label="Chat">💬</span> Study Chat
        </div>
        <BackToDashboardButton style={{ margin: "10px 0 18px 19px", alignSelf: "start" }} />
        {/* Messages Display */}
        <div
          className="chat-messages"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 14px 5px 14px",
            background: "#f8fafb",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
          aria-live="polite"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: msg.author === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
                marginBottom: 2,
                width: "100%"
              }}
            >
              {/* Message Bubble */}
              <div
                style={{
                  background: msg.author === "user"
                    ? "linear-gradient(97deg, #4F8A8B 92%, #FBD46D 100%)"
                    : "linear-gradient(97deg, #FBD46D 90%, #fff 100%)",
                  color: msg.author === "user" ? "#fff" : "#4F8A8B",
                  borderRadius: msg.author === "user"
                    ? "18px 18px 5px 18px"
                    : "18px 18px 18px 5px",
                  boxShadow: msg.author === "buddy"
                    ? "0 1px 3px 0 #fbd46d11"
                    : "0 1px 3px 0 #4f8a8b12",
                  padding: "11px 15px",
                  fontSize: "1.11em",
                  maxWidth: "82%",
                  wordWrap: "break-word",
                  marginLeft: msg.author === "user" ? 0 : 11,
                  marginRight: msg.author === "user" ? 11 : 0,
                  marginTop: idx === 0 ? 0 : 2,
                  transition: "background 0.16s"
                }}
              >
                {msg.author === "buddy" && (
                  <span role="img" aria-label="Buddy" style={{marginRight: 7}}>🤖</span>
                )}
                {msg.text}
                {msg.author === "user" && (
                  <span role="img" aria-label="You" style={{marginLeft: 7}}>👤</span>
                )}
              </div>
            </div>
          ))}
          {/* Loading/typing animation, or error */}
          {pendingBuddy && (
            <div style={{display: "flex", flexDirection: "row", alignItems: "flex-end"}}>
              <div
                style={{
                  background: "linear-gradient(97deg, #FBD46D99 95%, #fff 100%)",
                  color: "#977617",
                  borderRadius: "18px 18px 18px 7px",
                  padding: "11px 16px",
                  fontSize: "1.10em",
                  maxWidth: "68%",
                  boxShadow: "0 1px 3px 0 #fbd46d11",
                  marginLeft: 11,
                  marginTop: 2
                }}
              >
                <span role="img" aria-label="Buddy typing" style={{marginRight: 7}}>🤖</span>
                <span style={{letterSpacing: 2, opacity: 0.8}}>
                  <span className="buddy-typing">
                    <span style={{opacity: 0.62, fontSize: "1.09em"}}>...</span>
                  </span>
                </span>
              </div>
            </div>
          )}
          {error && (
            <div style={{ color: "#F76B8A", background: "#fbd44d2f", borderRadius: 13, padding: "7px 13px", margin: "9px 0", fontSize: "1.02em" }}>
              <span role="img" aria-label="Error" style={{marginRight: 7}}>⚠️</span>{error}
            </div>
          )}
          <div ref={chatBottomRef}></div>
        </div>
        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 8,
            padding: "12px 15px 17px 15px",
            background: "#fff",
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            borderTop: "1px solid #f4eada"
          }}
          autoComplete="off"
        >
          <input
            className="chat-input"
            type="text"
            placeholder={
              pendingBuddy
                ? "Wait for Study Buddy to reply..."
                : "Type your message here..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={pendingBuddy}
            maxLength={180}
            aria-label="Message"
            style={{
              flex: 1,
              border: "1.5px solid #F76B8A33",
              borderRadius: 13,
              padding: "9px 14px",
              fontSize: "1.08em",
              outline: "none",
              background: "#faf9fd",
              color: "#212226",
              boxShadow: "none"
            }}
            autoFocus
          />
          <button
            className="btn"
            type="submit"
            style={{
              borderRadius: 11,
              fontWeight: 700,
              background: pendingBuddy ? "#DEC8E0" : "var(--accent, #F76B8A)",
              color: "#fff",
              border: "none",
              fontSize: "1.16em",
              padding: "0 19px",
              minHeight: 42,
              cursor: pendingBuddy ? "not-allowed" : "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
            }}
            disabled={pendingBuddy || !input.trim()}
            aria-label="Send"
          >
            <span role="img" aria-label="Send">➡️</span>
          </button>
        </form>
      </div>
      {/* Responsive: Stack the chat card nicely on small screens */}
      <style>
        {`
        @media (max-width: 540px) {
          .chat-card {
            max-width: 99vw !important;
            min-width: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }
        `}
      </style>
      <div style={{ fontSize: "0.93em", color: "#bbb", marginTop: 10, textAlign: "center", maxWidth: 430 }}>
        Powered by OpenAI GPT-4.1. For secure API management, set <code>REACT_APP_OPENAI_API_KEY</code> in a <code>.env</code> file for local dev. Never commit secrets to source control.
      </div>
    </div>
  );
}

export default StudyChatPage;

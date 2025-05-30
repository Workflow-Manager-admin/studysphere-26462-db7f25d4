import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../UserContext";

/**
 * StudyChatPage: Provides a playful, responsive chat between user and a simulated Study Buddy.
 */

// Simulated Buddy responses (cycled or randomized for demo)
const BUDDY_REPLIES = [
  "Haha, good one! 😄",
  "I totally agree! 📚",
  "Let's crush these tasks together! 💪",
  "That's a great idea! 🤓",
  "You're on fire today! 🔥",
  "Lol! 😂 Wanna quiz later?",
  "Staying productive is key! 🗝️",
  "I found this topic tricky too! 🤔",
  "Let's take a 5-min break? ☕",
  "We make a great team! 👯‍♂️",
];

// Utility for picking a bot reply (for playful effect cycles/random)
function pickBuddyReply(lastBuddyIdx = -1) {
  // Cycle for demo so no immediate repeat
  let idx = Math.floor(Math.random() * BUDDY_REPLIES.length);
  if (idx === lastBuddyIdx)
    idx = (idx + 1) % BUDDY_REPLIES.length;
  return { reply: BUDDY_REPLIES[idx], idx };
}

// PUBLIC_INTERFACE
function StudyChatPage() {
  /**
   * Chat UI: Messages with user/buddy bubbles, playful colors, rounded styles.
   * Auto-scrolls to bottom on new message. Bot replies after short delay.
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
  const [lastBuddyIdx, setLastBuddyIdx] = useState(-1);
  const chatBottomRef = useRef(null);

  // Scroll to bottom of chat on new messages
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, pendingBuddy]);

  // Handle sending user message
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || pendingBuddy) return;
    setMessages(prev => [
      ...prev,
      { author: "user", text: input.trim() }
    ]);
    setInput("");
    setPendingBuddy(true);

    // Simulate slight delay for buddy response
    setTimeout(() => {
      const { reply, idx } = pickBuddyReply(lastBuddyIdx);
      setMessages((prev) => [
        ...prev,
        { author: "buddy", text: reply }
      ]);
      setLastBuddyIdx(idx);
      setPendingBuddy(false);
    }, 950 + Math.random() * 750);
  };

  // Enter key sends message
  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend(e);
    }
  };

  // Responsive & playful styles (rounded bubbles, accent color, emojis)
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
          {/* Optional: Animated typing... */}
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
    </div>
  );
}

export default StudyChatPage;

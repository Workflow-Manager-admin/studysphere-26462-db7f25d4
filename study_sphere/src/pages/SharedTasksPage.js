import React, { useState, useEffect } from "react";
import BackToDashboardButton from "./BackToDashboardButton";

/**
 * SharedTasksPage
 * Allows user to add new tasks, see a list, check off completed ones (strikethrough on checked),
 * stores tasks in sessionStorage (session only), and styled with soft colors and rounded UI.
 */

const STORAGE_KEY = "studysphere_sharedtasks";

// PUBLIC_INTERFACE
function SharedTasksPage() {
  // Load from sessionStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [newTask, setNewTask] = useState("");

  // Save tasks to sessionStorage whenever tasks change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // PUBLIC_INTERFACE
  function handleAddTask(e) {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          text: newTask.trim(),
          completed: false,
        },
      ]);
      setNewTask("");
    }
  }

  // PUBLIC_INTERFACE
  function handleToggle(i) {
    setTasks((prev) =>
      prev.map((task, idx) =>
        idx === i
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  }

  // PUBLIC_INTERFACE
  function handleDelete(i) {
    setTasks((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="tasks-page-wrapper">
      <div className="tasks-card">
        <h2 className="tasks-title" style={{ color: "var(--kavia-orange)", marginBottom: 8 }}>
          Shared Tasks
        </h2>
        <p className="tasks-desc" style={{ color: "var(--kavia-dark)", opacity: "0.7" }}>
          Add, check off, and manage your group's study tasks.<br />
          <span style={{ fontSize: 18 }}>📝</span>
        </p>
        <form onSubmit={handleAddTask} className="task-form" autoComplete="off">
          <input
            className="task-input"
            value={newTask}
            placeholder="Add a new task..."
            onChange={(e) => setNewTask(e.target.value)}
            style={{
              borderRadius: 12,
              border: "1px solid var(--border-color, #eee)",
              padding: "12px 16px",
              fontSize: 16,
              marginRight: 8,
              outline: "none",
              background: "#f8fafb",
              width: "70%",
              maxWidth: 320,
              boxSizing: "border-box"
            }}
          />
          <button
            className="btn"
            style={{
              borderRadius: 10,
              padding: "0.65em 1.5em",
              fontWeight: 600,
              background: "var(--kavia-orange, #E87A41)",
              color: "#fff",
              border: "none"
            }}
            type="submit"
          >
            Add
          </button>
        </form>
        <ul className="tasks-list" style={{ marginTop: 16 }}>
          {tasks.length === 0 && (
            <li style={{ color: "#bbb", fontStyle: "italic", marginTop: 16 }}>No tasks yet!</li>
          )}
          {tasks.map((task, i) => (
            <li
              key={i}
              className="task-item"
              style={{
                background: "#f4f7fa",
                margin: "8px 0",
                borderRadius: 11,
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 1px 3px 0 rgba(80,70,60,0.07)",
                gap: 12
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(i)}
                style={{
                  width: 19,
                  height: 19,
                  marginRight: 10,
                  accentColor: "#4F8A8B",
                  borderRadius: 5
                }}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "#999" : "#222",
                  opacity: task.completed ? 0.6 : 1,
                  fontSize: 17,
                  transition: "all 0.2s"
                }}
              >
                {task.text}
              </span>
              <button
                title="Delete task"
                className="btn"
                onClick={() => handleDelete(i)}
                style={{
                  borderRadius: 7,
                  background: "var(--accent, #F76B8A)",
                  color: "#fff",
                  border: "none",
                  padding: "0.3em 1em",
                  fontWeight: 600,
                  fontSize: 14,
                  marginLeft: 7,
                  cursor: "pointer"
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SharedTasksPage;

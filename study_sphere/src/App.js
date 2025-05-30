import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import JoinPage from './pages/JoinPage';
import DashboardPage from './pages/DashboardPage';
import SharedTasksPage from './pages/SharedTasksPage';
import QuizBattlePage from './pages/QuizBattlePage';
import StudyChatPage from './pages/StudyChatPage';
import FocusModePage from './pages/FocusModePage';
import { UserProvider } from './UserContext';

/**
 * Main StudySphere App container with routing for all major features/pages.
 */
function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app">
          <nav className="navbar">
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div className="logo">
                  <span className="logo-symbol">*</span> StudySphere
                </div>
                <button className="btn" tabIndex={-1} disabled>
                  Menu
                </button>
              </div>
            </div>
          </nav>

          <main style={{ paddingTop: 72 }}>
            <div className="container">
              <Routes>
                <Route path="/" element={<Navigate to="/join" replace />} />
                <Route path="/join" element={<JoinPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/focus" element={<FocusModePage />} />
                <Route path="/tasks" element={<SharedTasksPage />} />
                <Route path="/quiz" element={<QuizBattlePage />} />
                <Route path="/chat" element={<StudyChatPage />} />
                <Route path="*" element={<div>404 Page Not Found</div>} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
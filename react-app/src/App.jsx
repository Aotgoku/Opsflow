import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import TaskBoard from './components/TaskBoard';
import Layout from './components/Layout';
import MyTasks from './components/MyTasks';
import Team from './components/Team';
import Settings from './components/Settings';
import Docs from './components/Docs';
import Support from './components/Support';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Auth />} />

          {/* Protected Routes inside Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/board" element={<TaskBoard />} />
            <Route path="/board/:boardId" element={<TaskBoard />} />
            <Route path="/tasks" element={<MyTasks />} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/support" element={<Support />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

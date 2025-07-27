import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider, useApp } from './contexts/AppContext';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MyTasks from './components/MyTasks';
import Calendar from './components/Calendar';
import AISuggestions from './components/AISuggestions';
import Settings from './components/Settings';
import OAuthCallback from './pages/OAuthCallback'; 
import Login from './components/Login';
import CalendarDebug from './components/CalendarDebug';
import axios from 'axios';

const Shell: React.FC = () => {
  const { state } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { dispatch } = useApp(); 
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem('groplanner-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.provider_token;
      const user = data.session?.user;

      if (accessToken) { //helps us to capture token after login
        localStorage.setItem('google-access-token', accessToken);
        localStorage.setItem('groplanner-user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
      }
    };

    getSession();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!user) return;

  //     const { data: tasks, error: taskError } = await supabase
  //       .from('tasks')
  //       .select('*')
  //       .eq('user_id', user.id);

  //     if (taskError) console.error("Supabase fetch error:", taskError);
  //     else dispatch({ type: 'SET_TASKS', payload: tasks });

  //     const accessToken = localStorage.getItem('google-access-token');
  //     try {
  //       const response = await axios.get('http://localhost:5000/auth/calendar/events', {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'x-user-email': user.email,
  //         },
  //       });

  //       const googleEvents = response.data.map((g: any) => ({
  //         id: g.id,
  //         title: g.summary || '(no title)',
  //         start: g.start?.dateTime || g.start?.date,
  //         end: g.end?.dateTime || g.end?.date,
  //         type: 'meeting',
  //         color: '#3B82F6',
  //       }));

  //       dispatch({ type: 'SET_EVENTS', payload: googleEvents });
  //     } catch (err) {
  //       console.error("Google Calendar fetch error:", err);
  //     }
  //   };

  //   fetchData();
  // }, [user, dispatch]);

  const renderCurrentTab = () => {
    switch (state.currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <MyTasks />;
      case 'calendar':
        return <Calendar />;
      case 'ai-suggestions':
        return <AISuggestions />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div>
          <h1 className="text-3xl text-center font-bold mb-4">Welcome to GroPlanner</h1>
          <Login onSuccess={() => setIsAuthenticated(true)} />
        </div>
      </div>
    );
  }

  return (
  <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      <CalendarDebug />           
      {renderCurrentTab()}
    </main>
  </div>
);
};

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/auth/callback/handler" element={<OAuthCallback />} />
            <Route path="/debug" element={<CalendarDebug />} />
            <Route path="/*" element={<Shell />} />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
function dispatch(arg0: { type: string; payload: any[]; }) {
  throw new Error('Function not implemented.');
}


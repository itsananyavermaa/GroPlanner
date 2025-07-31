import React, { useEffect } from 'react'; 
import axios from 'axios';               
import { Clock, CheckCircle, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../supabaseClient';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const { dispatch } = useApp();
  const tasks = state.tasks;
  const events = state.events;

//   const fetchTasks = async () => {
//   const { data, error } = await supabase.from('tasks').select('*');
//   if (error) {
//     console.error('Error fetching tasks:', error.message);
//     return;
//   }
//   dispatch({ type: 'SET_TASKS', payload: data }); // ✅ Correct now
// // };
//   useEffect(() => {
//   const fetchGoogleEvents = async () => {
//     const token = localStorage.getItem('groplanner-auth-token');
//     const userRaw = localStorage.getItem('groplanner-user');
//     const user = userRaw ? JSON.parse(userRaw) : null;
//     if (!token || !user?.email) return;

//     try {
//       const { data } = await axios.get(
//         'http://localhost:5000/auth/calendar/events',
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'x-user-email': user.email,
//           },
//         }
//       );

//       // transform Google events → internal shape
//       const events = data.map((g: any) => ({
//         id: g.id,
//         title: g.summary || '(no title)',
//         start: g.start?.dateTime || g.start?.date,
//         end: g.end?.dateTime || g.end?.date,
//         type: 'meeting',          // customise if you like
//         color: '#3B82F6',         // pick any color
//       }));

//       dispatch({ type: 'SET_EVENTS', payload: events });
//       console.log('Google events loaded:', events);
//     } catch (err) {
//       console.error('Google Calendar fetch error:', err);
//     }
//   };

//     fetchGoogleEvents();
// }, [dispatch, state.events.length]);
  
//   const fetchTasks = async () => {
//   const { data, error } = await supabase.from('tasks').select('*');

//   if (error) {
//     console.error('Error fetching tasks:', error.message);
//     return;
//   }

//   dispatch({ type: 'SET_EVENTS', payload: data });
// };


  const today = new Date().toISOString().split('T')[0];
  const todayTasks = state.tasks.filter(task => 
    task.deadline === today || (!task.deadline && !task.completed)
  );
  
  const completedTasks = todayTasks.filter(task => task.completed);
  const pendingTasks = todayTasks.filter(task => !task.completed);
  const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
  
  const totalDuration = pendingTasks.reduce((sum, task) => sum + task.duration, 0);
  const freeTime = Math.max(0, 480 - totalDuration); 

  const handlePlanMyDay = () => {

    dispatch({ type: 'SET_TAB', payload: 'ai-suggestions' });

  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                Hey! Ready to tackle your day?
              </h2>
              <p className="text-gray-600">
                Here's your schedule overview for {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((completedTasks.length / todayTasks.length) * 100) || 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Daily Progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Tasks */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-semibold text-gray-900">{todayTasks.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-semibold text-gray-900">{completedTasks.length}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          {/* High Priority */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">High Priority</p>
                <p className="text-3xl font-semibold text-gray-900">{highPriorityTasks.length}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          {/* Free Time */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Free Time</p>
                <p className="text-3xl font-semibold text-gray-900">{Math.floor(freeTime / 60)}h {freeTime % 60}m</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <button
            onClick={handlePlanMyDay}
            className="px-8 py-3 bg-blue-600 rounded-lg font-medium text-white hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              <span>Plan My Day with AI</span>
            </div>
          </button>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Today's Tasks</h3>
            </div>
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map((task) => (
                <div 
                  key={task.id} 
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 
                        'bg-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.duration} min • {task.category}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Upcoming Events</h3>
            </div>
            <div className="space-y-3">
              {state.events
                .filter((event) => new Date(event.start) > new Date())
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                .slice(0, 5)
                .map((event) => (
                <div 
                  key={event.id} 
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: event.color || '#3B82F6' }} 
                    />
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.start).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        at{' '}
                        {new Date(event.start).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Productivity Insights */}
        <div className="mt-8 bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">
              Productivity Insights
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-4xl font-semibold text-gray-900 mb-2">
                {Math.round((completedTasks.length / todayTasks.length) * 100) || 0}%
              </p>
              <p className="text-gray-700 font-medium mb-3">Completion Rate</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((completedTasks.length / todayTasks.length) * 100) || 0}%` }}
                />
              </div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-4xl font-semibold text-gray-900 mb-2">
                {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
              </p>
              <p className="text-gray-700 font-medium mb-3">Planned Work</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-4xl font-semibold text-gray-900 mb-2">
                {state.tasks.filter(t => t.category === 'work').length}
              </p>
              <p className="text-gray-700 font-medium mb-3">Work Tasks</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-full bg-green-600 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
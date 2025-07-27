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
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
    {/* Enhanced futuristic background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/8 to-cyan-400/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-br from-indigo-400/8 to-blue-400/8 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.04)_1px,transparent_0)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header with enhanced glassmorphism effect */}
        <div className="mb-8 backdrop-blur-xl bg-white/60 rounded-2xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-purple-500/3 rounded-2xl"></div>
          
          <div className="relative flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
              <Sparkles className="w-6 h-6 text-white relative z-10" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-2">
                Hey! Ready to tackle your day?
              </h2>
              <p className="text-gray-600">
                Here's your schedule overview for {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Enhanced progress bar */}
          <div className="w-full bg-gray-100/50 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-white/30">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${Math.round((completedTasks.length / todayTasks.length) * 100) || 0}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Daily Progress</p>
        </div>

        {/* Enhanced Stats Cards with different colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Tasks - Blue/Cyan theme */}
          <div className="group bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-300 shadow-xl shadow-blue-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{todayTasks.length}</p>
                <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2"></div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Completed - Purple/Pink theme */}
          <div className="group bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-purple-200/30 hover:border-purple-300/50 transition-all duration-300 shadow-xl shadow-purple-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{completedTasks.length}</p>
                <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* High Priority - Orange/Red theme */}
          <div className="group bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-orange-200/30 hover:border-orange-300/50 transition-all duration-300 shadow-xl shadow-orange-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">High Priority</p>
                <p className="text-3xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{highPriorityTasks.length}</p>
                <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2"></div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Free Time - Green/Emerald theme */}
          <div className="group bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-green-200/30 hover:border-green-300/50 transition-all duration-300 shadow-xl shadow-green-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Free Time</p>
                <p className="text-3xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{Math.floor(freeTime / 60)}h {freeTime % 60}m</p>
                <div className="w-8 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2"></div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <button
            onClick={handlePlanMyDay}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl font-medium text-white hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 relative overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
            <div className="relative flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              <span>Plan My Day with AI</span>
            </div>
          </button>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Today's Tasks</h3>
            </div>
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map((task) => (
                <div 
                  key={task.id} 
                  className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-blue-200/50 transition-all duration-200 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        task.priority === 'high' ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/25' : 
                        task.priority === 'medium' ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25' : 
                        'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-800">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.duration} min • {task.category}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                      task.priority === 'high' ? 'bg-orange-100/80 text-orange-700 border border-orange-200/50' :
                      task.priority === 'medium' ? 'bg-purple-100/80 text-purple-700 border border-purple-200/50' :
                      'bg-blue-100/80 text-blue-700 border border-blue-200/50'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Upcoming Events</h3>
            </div>
            <div className="space-y-3">
              {state.events
                .filter((event) => new Date(event.start) > new Date())
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                .slice(0, 5)
                .map((event) => (
                <div 
                  key={event.id} 
                  className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-purple-200/50 transition-all duration-200 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full shadow-lg" 
                      style={{ backgroundColor: event.color || '#3B82F6' }} 
                    />
                    <div>
                      <p className="font-medium text-gray-800">{event.title}</p>
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

        {/* Enhanced Productivity Insights */}
        <div className="mt-8 bg-white/70 backdrop-blur-xl rounded-xl p-8 border border-white/20 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-purple-500/3 rounded-xl"></div>
          
          <div className="relative flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
              Productivity Insights
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <p className="text-4xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {Math.round((completedTasks.length / todayTasks.length) * 100) || 0}%
              </p>
              <p className="text-gray-700 font-medium">Completion Rate</p>
              <div className="w-full bg-gray-100/50 rounded-full h-2 mt-3 backdrop-blur-sm border border-white/30">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${Math.round((completedTasks.length / todayTasks.length) * 100) || 0}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <p className="text-4xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
              </p>
              <p className="text-gray-700 font-medium">Planned Work</p>
              <div className="w-full bg-gray-100/50 rounded-full h-2 mt-3 backdrop-blur-sm border border-white/30">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <p className="text-4xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {state.tasks.filter(t => t.category === 'work').length}
              </p>
              <p className="text-gray-700 font-medium">Work Tasks</p>
              <div className="w-full bg-gray-100/50 rounded-full h-2 mt-3 backdrop-blur-sm border border-white/30">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
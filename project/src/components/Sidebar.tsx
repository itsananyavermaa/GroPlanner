import React from 'react';
import { Calendar, CheckSquare, Home, Settings, Sparkles} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import LogoutButton from './LogoutButton';


const Sidebar: React.FC = () => {
  const { state, dispatch } = useApp();
  const user = state.user || JSON.parse(localStorage.getItem('groplanner-user') || '{}');

  useTheme();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'ai-suggestions', label: 'AI Suggestions', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
  <div className="w-64 bg-gradient-to-b from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 border-r border-blue-200/50 dark:border-gray-700/50 h-screen flex flex-col shadow-xl backdrop-blur-sm">
    
    {/* Header */}
    <div className="p-6 border-b border-blue-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-xl shadow-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        GroPlanner
      </h1>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
        Your Daily Planning Assistant
      </p>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-4 py-6 space-y-1">
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = state.currentTab === item.id;

        return (
          <div key={item.id} className="relative group" style={{ animationDelay: `${index * 50}ms` }}>
            <button
              onClick={() => dispatch({ type: 'SET_CURRENT_TAB', payload: item.id })}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 ease-out relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-600/10 text-blue-700 dark:text-cyan-300 shadow-lg border border-blue-300/40 dark:border-cyan-500/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-cyan-100/50 hover:to-blue-100/50 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 hover:shadow-md hover:translate-x-1'
              } group-hover:scale-[1.02] transform`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-600 rounded-r-full shadow-sm" />
              )}

              <div className={`relative p-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-br from-blue-400/20 via-cyan-400/20 to-blue-500/20 shadow-md'
                  : 'group-hover:bg-blue-100/60 dark:group-hover:bg-gray-600/40'
              }`}>
                <Icon className={`w-4 h-4 transition-all duration-300 ${isActive ? 'drop-shadow-sm' : ''}`} />
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-cyan-400/20 to-blue-500/20 rounded-lg blur-sm -z-10" />
                )}
              </div>

              <span className={`font-semibold text-sm tracking-wide transition-all duration-300 ${
                isActive ? 'text-blue-900 dark:text-white' : ''
              }`}>
                {item.label}
              </span>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out" />
            </button>
          </div>
        );
      })}
    </nav>

    {/* Footer */}
<div className="p-4 border-t border-blue-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-b-xl">
  <div className="flex items-center justify-between gap-3">
    {/* Avatar */}
    {user && (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow">
        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
      </div>
    )}

    {/* Logout Button */}
    <div className="transform hover:scale-[1.05] transition-all duration-300">
      <LogoutButton />
    </div>
  </div>
</div>
  </div>
);

};
export default Sidebar;
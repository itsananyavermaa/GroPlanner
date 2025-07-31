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
  <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col shadow-sm">
    
    {/* Header */}
    <div className="p-6 border-b border-gray-200">
      <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        GroPlanner
      </h1>
      <p className="text-xs text-gray-500 mt-1 font-medium">
        Your Daily Planning Assistant
      </p>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-4 py-6 space-y-1">
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = state.currentTab === item.id;

        return (
          <div key={item.id} className="relative">
            <button
              onClick={() => dispatch({ type: 'SET_CURRENT_TAB', payload: item.id })}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
              )}

              <div className={`p-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-100'
                  : 'group-hover:bg-gray-100'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <span className="font-semibold text-sm">
                {item.label}
              </span>
            </button>
          </div>
        );
      })}
    </nav>

    {/* Footer */}
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center justify-between gap-3">
        {/* Avatar */}
        {user && (
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
          </div>
        )}

        {/* Logout Button */}
        <div className="hover:opacity-75 transition-opacity duration-200">
          <LogoutButton />
        </div>
      </div>
    </div>
  </div>
);

};
export default Sidebar;
import React, { useState } from 'react';
import { Save, User, Clock} from 'lucide-react';
import { useApp, UserSettings } from '../contexts/AppContext';
import { supabase } from '../supabaseClient'; 

const saveSettings = async (settings: UserSettings) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not logged in:", userError?.message);
      return { success: false, message: userError?.message || "User not logged in" };
    }

    const { error: upsertError } = await supabase
      .from('settings')
      .upsert([{ ...settings, user_id: user.id }]);

    if (upsertError) {
      console.error("Failed to upsert settings:", upsertError);
      return { success: false, message: upsertError.message };
    }

    return { success: true };
  } catch (e: any) {
    console.error("Unexpected error while saving settings:", e);
    return { success: false, message: e.message || "Unexpected error" };
  }
};


const Settings: React.FC = () => {
  const { state, dispatch } = useApp();
  const [settings, setSettings] = useState(state.settings);

  const handleSave = async () => {
    const result = await saveSettings(settings); // <-- use local state!

    if (!result.success) {
      alert("Could not save settings: " + result.message);
    } else {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      alert('Settings saved successfully!');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkHoursChange = (field: 'start' | 'end', value: string) => {
    setSettings(prev => ({
      ...prev,
      preferredWorkHours: {
        ...prev.preferredWorkHours,
        [field]: value
      }
    }));
  };

  return (
  <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-blue-100/50 dark:border-gray-700 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <Save className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">Customize your scheduling preferences and AI behavior</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Work Hours */}
        <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-blue-100/50 dark:border-gray-700 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Work Hours</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Start Time
              </label>
              <input
                type="time"
                value={settings.preferredWorkHours.start}
                onChange={(e) => handleWorkHoursChange('start', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                End Time
              </label>
              <input
                type="time"
                value={settings.preferredWorkHours.end}
                onChange={(e) => handleWorkHoursChange('end', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* AI Personality */}
        <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-blue-100/50 dark:border-gray-700 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Personality</h3>
          </div>
          <div className="space-y-4">
            {[
              { value: 'strict', label: 'Strict', description: 'Focused on efficiency and meeting deadlines' },
              { value: 'flexible', label: 'Flexible', description: 'Balanced approach with room for adjustments' },
              { value: 'wellness-focused', label: 'Wellness-focused', description: 'Prioritizes work-life balance and wellbeing' }
            ].map((option) => (
              <label key={option.value} className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="radio"
                  name="aiPersonality"
                  value={option.value}
                  checked={settings.aiPersonality === option.value}
                  onChange={(e) => handleInputChange('aiPersonality', e.target.value)}
                  className="w-4 h-4 mt-1 text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-900 transition-colors">
                    {option.label}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Break Interval */}
        <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-blue-100/50 dark:border-gray-700 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Break Preferences</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Break Interval (minutes)
            </label>
            <div className="flex items-start gap-4">
              <input
                type="number"
                value={settings.breakInterval}
                onChange={(e) => handleInputChange('breakInterval', Number(e.target.value))}
                className="w-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                min="5"
                max="60"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 pt-3">
                Recommended break every {settings.breakInterval} minutes of work
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-lg flex items-center gap-3 hover:from-indigo-700 hover:to-blue-700 transition-colors shadow-md font-medium"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
);

};

export default Settings;
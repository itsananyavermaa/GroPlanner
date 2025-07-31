import { useState } from "react";
import axios from "axios";
import { useApp } from "../contexts/AppContext";

const AISuggestions = () => {
  const { state } = useApp();
  const [plan, setPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const todayTasks = state.tasks.filter(task => {
    if (!task.deadline) return false;
    const taskDate = new Date(task.deadline).toISOString().split("T")[0];
    return taskDate === today;
  });

  const todayEvents = state.events?.filter(event => {
  if (!event.start) return false;
    const eventDate = new Date(event.start).toISOString().split("T")[0];      
    return eventDate === today;
  }) || [];
  const generatePlan = async () => {
    try {
      setLoading(true);

      const payload = {
        tasks: todayTasks.map(task => ({
          title: task.title,
          duration: task.duration,
          deadline: task.deadline,
          priority: task.priority,
        })),
        events: todayEvents.map(event => ({
          summary: event.summary,
          start: event.start,
          end: event.end,
      })),
        settings: state.settings
      };

      const response = await axios.post("https://groplanner-backend.onrender.com/ai/plan", payload);
      setPlan(response.data.schedule);
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
    <div className="max-w-3xl mx-auto px-8 py-12">
      {/* Header Section */}
      <div className="mb-12 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Planner</h1>
            <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{todayTasks.length} tasks pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{todayEvents.length} events today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mb-12 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <button
          onClick={generatePlan}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Generating Plan
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Smart Plan
            </>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mb-12 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <div>
              <p className="font-medium text-gray-900">Analyzing your schedule</p>
              <p className="text-sm text-gray-600">Creating the perfect plan for your day</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {plan.length > 0 && !loading && (
        <div className="space-y-8">
          {/* Results Header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your Schedule</h2>
              <p className="text-sm text-gray-600">Smart planning for maximum productivity</p>
            </div>
          </div>

          {/* Schedule Items */}
          <div className="space-y-3">
            {plan.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-5 flex items-start gap-4">
                  {/* Time Badge */}
                  <div className="flex-shrink-0 pt-1">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 font-medium rounded-full text-sm border border-blue-100">
                      {item.time}
                    </span>
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0 max-w-full">
                    <div className="bg-gray-50 text-gray-900 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 w-full break-words whitespace-pre-wrap overflow-hidden">
                      {item.task}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{plan.length} items scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Optimized for productivity</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

};

export default AISuggestions;

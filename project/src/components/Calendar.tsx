import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useApp } from '../contexts/AppContext';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
Modal.setAppElement('#root');

const Calendar: React.FC = () => {
  const { state , dispatch } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    start: '',
    end: '',
    type: 'meeting',
    color: '#3B82F6'
  });
  useEffect(() => {
  const fetchGoogleEvents = async () => {
    const token = localStorage.getItem('google-access-token');

    if (!token) return;

    try {
      const { data } = await axios.get('http://localhost:5000/auth/calendar/events', {
        headers: {
          'x-google-token': token,
        },
      });

      const parsed = data.map((e: { id: any; summary: any; start: { dateTime: any; date: any; }; end: { dateTime: any; date: any; }; }) => ({
        id: e.id,
        title: e.summary || '(no title)',
        start: e.start.dateTime || e.start.date,
        end: e.end.dateTime || e.end.date,
        color: '#4285F4',
        type: 'Google',
      }));

      dispatch({ type: 'SET_EVENTS', payload: parsed });
    } catch (err) {
      console.error('❌ Error loading events:', err);
    }
  };

  fetchGoogleEvents();
}, []);

const handleSyncGoogleCalendar = async () => {
  try {
    const res = await axios.get('/api/google/events', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('groplanner-token')}`,
      },
    });

    if (res.data && res.data.events) {
      dispatch({ type: 'SET_EVENTS', payload: res.data.events });
      alert('Google Calendar synced successfully!');
    } else {
      alert('Google Calendar synced successfully!');
    }
  } catch (error) {
    console.error('Error syncing Google Calendar:', error);
    alert('Failed to sync calendar. Try again.');
  }
};


  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date();

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDay = (day: number | undefined) => {
  if (!day) return [];

  return state.events.filter(event => {
    const eventDate = new Date(event.start);
    const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    // Compare year, month, date
    return (
      eventDate.getDate() === calendarDate.getDate() &&
      eventDate.getMonth() === calendarDate.getMonth() &&
      eventDate.getFullYear() === calendarDate.getFullYear()
    );
  });
};


  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
  <>
    <Modal
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-8 rounded-2xl max-w-md mx-auto mt-24 shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Event</h2>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Event title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all outline-none"
          />
        </div>
        <div>
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="w-full p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start</label>
            <input
              type="time"
              value={newEvent.start}
              onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
              className="w-full p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End</label>
            <input
              type="time"
              value={newEvent.end}
              onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
              className="w-full p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="flex-1 px-4 py-3 bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200/80 dark:hover:bg-gray-600/50 transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={async () => {
            const token = localStorage.getItem('groplanner-auth-token');
            const user = JSON.parse(localStorage.getItem('groplanner-user') || '{}');
            const googleAccessToken = localStorage.getItem('google-access-token');

            const startISO = `${newEvent.date}T${newEvent.start}:00`;
            const endISO = `${newEvent.date}T${newEvent.end}:00`;

            try {
              const { data } = await axios.post(
                'http://localhost:5000/auth/calendar/events',
                { title: newEvent.title, start: startISO, end: endISO },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'x-user-email': user.email,
                    'x-google-access-token': googleAccessToken,
                  },
                }
              );
              dispatch({ type: 'ADD_EVENT', payload: data });
              setShowModal(false);
            } catch (err) {
              console.error('❌ Error adding event:', err);
            }
          }}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          Save Event
        </button>
      </div>
    </Modal>
  
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
    
     {/* Header */}
<div className="mb-8 bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-blue-100/50 dark:border-gray-700 shadow-lg">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h2>
      <p className="text-gray-600 dark:text-gray-400">View and manage your schedule</p>
    </div>
  </div>
</div>


      {/* Sync Calendar */}
<div className="mb-6 bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-blue-100/50 dark:border-gray-700 shadow-lg">
  <button
    onClick={handleSyncGoogleCalendar}
    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
  >
    <div className="w-5 h-5 flex items-center justify-center">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </div>
    <span>Sync Google Calendar</span>
  </button>
</div>


      {/* Calendar */}
      <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="p-2.5 hover:bg-gray-100/60 dark:hover:bg-gray-700/40 rounded-xl transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2.5 hover:bg-gray-100/60 dark:hover:bg-gray-700/40 rounded-xl transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="h-28"></div>
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const isToday = 
                today.getDate() === day &&
                today.getMonth() === currentDate.getMonth() &&
                today.getFullYear() === currentDate.getFullYear();
              const events = getEventsForDay(day);

              return (
                <div
                  key={day}
                  className={`h-28 p-2 rounded-xl border transition-all cursor-pointer group ${
                    isToday 
                      ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200/60 dark:border-blue-700/60 shadow-md' 
                      : 'border-gray-200/40 dark:border-gray-700/40 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 hover:border-gray-300/60 dark:hover:border-gray-600/60'
                  }`}
                >
                  <div className={`text-sm font-semibold mb-2 ${
                    isToday 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {events.slice(0, 2).map((event, idx) => (
                      <div
                        key={event.id}
                        className="text-xs px-2 py-1 rounded-md text-white truncate shadow-sm"
                        style={{ backgroundColor: event.color }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                        +{events.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mt-8 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h3>
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
          {state.events.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 mb-2">📅</div>
              <p className="text-gray-500 dark:text-gray-400">No upcoming events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
);
};

export default Calendar;
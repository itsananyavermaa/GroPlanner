// src/components/CalendarDebug.tsx
import { useEffect } from 'react';
import axios from 'axios';

const CalendarDebug = () => {
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('groplanner-auth-token');
      const user = JSON.parse(localStorage.getItem('groplanner-user') || '{}');
      if (!token) return;
      try {
        const { data } = await axios.get(
          'http://localhost:5000/auth/calendar/events',
          { headers: { Authorization: `Bearer ${token}`,
            'x-user-email': user.email} }
        );
        console.log('Calendar events:', data);
      } 
      catch (err) {
        console.error('Calendar fetch error:', err);
      }
    };
    fetchEvents();
  }, []);

  return null;
};

export default CalendarDebug;

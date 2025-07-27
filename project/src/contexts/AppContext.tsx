import React, { createContext, useContext, useReducer, ReactNode, useEffect} from 'react';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

export interface Task {
  end_time: string | number | Date;
  start_time: string | number | Date;
  id: string;
  title: string;
  duration: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  category: 'work' | 'personal' | 'health' | 'other';
  completed: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  summary: any;
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'meeting' | 'appointment' | 'reminder' | 'task';
  color: string;
}

export interface UserSettings {
  preferredWorkHours: {
    start: string;
    end: string;
  };
  breakInterval: number; // in minutes
  aiPersonality: 'strict' | 'flexible' | 'wellness-focused'
}

interface AppState {
  user: any;
  tasks: Task[];
  events: CalendarEvent[];
  settings: UserSettings;
  currentTab: string;
}

type AppAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'SET_TAB'; payload: string }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'SET_EVENTS';  payload: CalendarEvent[] } 
  | { type: 'SET_TASKS';  payload: Task[] } 
  | { type: 'TOGGLE_TASKS';  payload: Task[] } 
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'SET_USER';  payload: User } 
  | { type: 'SET_CURRENT_TAB'; payload: string };


const initialState: AppState = {
  user : null,
  tasks: [],
  events: [],
  settings: {
    preferredWorkHours: {
      start: '',
      end: ''
    },
    breakInterval: 0,
    aiPersonality: 'flexible'
  },
  currentTab: 'dashboard',
};



const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload]
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'SET_CURRENT_TAB':
      return {
        ...state,
        currentTab: action.payload
      };
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload,
      };
    case 'SET_TASKS':
      return { 
        ...state, tasks: action.payload 
      };
    case 'SET_TAB':
       return {
        ...state,
         currentTab: action.payload,
    };
    case 'SET_USER':
      return {
        ...state,
        user : action.payload
      }
    default:
      return state;
  }
};



interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const fetchUserSettings = async (userId: string): Promise<UserSettings | null> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching settings:', error.message);
    return null;
  }

  const settings: UserSettings = {
    preferredWorkHours: data.preferredWorkHours || { start: '', end: '' },
    breakInterval: data.breakInterval || 0,
    aiPersonality: data.aiPersonality || 'flexible'
  };

  return settings;
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
  const loadUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    const session = data?.session;

    if (error || !session?.user) {
      console.warn("No user session found");
      dispatch({ type: 'SET_USER', payload: null });
      localStorage.removeItem('groplanner-user');
      return;
    }

    const user = session.user;

    dispatch({ type: 'SET_USER', payload: user });
    localStorage.setItem('groplanner-user', JSON.stringify(user));

    const userSettings = await fetchUserSettings(user.id);
    if (userSettings) {
      dispatch({ type: 'UPDATE_SETTINGS', payload: userSettings });
    }
  };

  const storedUser = localStorage.getItem('groplanner-user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    dispatch({ type: 'SET_USER', payload: parsedUser });

    fetchUserSettings(parsedUser.id).then((userSettings) => {
      if (userSettings) {
        dispatch({ type: 'UPDATE_SETTINGS', payload: userSettings });
      }
    });
  } else {
    loadUser();
  }
}, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
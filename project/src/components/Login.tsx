// // src/components/Login.tsx
// import { supabase } from '../supabaseClient';

// const Login = () => {
//   const handleLogin = async () => {
//     await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
//         redirectTo: 'https://gro-planner.vercel.app/',
//       },
//     });
//   };

//   return (
//     <button
//       onClick={handleLogin}
//       className="px-6 py-3 rounded bg-blue-600 text-white font-semibold"
//     >
//       Sign in with Google
//     </button>
//   );
// };

// export default Login;

// src/components/Login.tsx
import { supabase } from '../supabaseClient';

type LoginProps = {
  onSuccess: () => void;
};

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
        redirectTo: window.location.origin,
      },
    });

    if (!error) {
      onSuccess(); // ✅ Call the callback only if login succeeds
    } else {
      console.error('Login error:', error.message);
    }
  };

  return (
  <button
    onClick={handleLogin}
    className="group relative px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-200 ease-out flex items-center gap-3 min-w-[200px] justify-center shadow-sm"
  >
    {/* Google Icon */}
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    
    <span className="text-gray-700 group-hover:text-gray-800 transition-colors duration-200">
      Sign in with Google
    </span>
    
    {/* Subtle hover effect overlay */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
  </button>
);
};

export default Login;

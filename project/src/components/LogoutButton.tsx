// src/components/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
      return;
    }

    // Clean up anything else you cached manually
    localStorage.removeItem('groplanner-user');
    localStorage.removeItem('google-access-token');

    console.log('🚪 Logged out');
    navigate('/');
    window.location.reload();       // reset app state
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
    >
      Sign Out
    </button>
  );
};

export default LogoutButton;

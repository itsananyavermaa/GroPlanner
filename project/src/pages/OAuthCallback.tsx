import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const token = qs.get('token');
    const name = qs.get('name');
    const email = qs.get('email');

    console.log('Params from Google redirect:', { token, name, email });

    if (token && name && email) {
      localStorage.setItem('groplanner-auth-token', token);
      localStorage.setItem('groplanner-user', JSON.stringify({ name, email }));
      console.log('Auth stored in localStorage');
      navigate('/');
    } else {
      console.error('Missing token, name, or email in query params');
    }
  }, [navigate]);

  return <div className="text-center mt-10 text-xl">Logging you in...</div>;
};

export default OAuthCallback;
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const OAuthCallback = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const code = new URLSearchParams(window.location.search).get('code');
//     if (code) {
//       axios.post('http://localhost:5000/auth/google/callback', { code })
//         .then((res) => {
//           const { appToken, user, googleAccessToken } = res.data;
//           localStorage.setItem('groplanner-auth-token', appToken);
//           localStorage.setItem('groplanner-user', JSON.stringify(user));
//           localStorage.setItem('google-access-token', googleAccessToken); // ✅ STORE THIS!
//           navigate('/');
//         })
//         .catch((err) => console.error('OAuth error:', err));
//     }
//   }, []);

//   return <div>Signing you in...</div>;
// };

// export default OAuthCallback;

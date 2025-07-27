// const express = require('express');
// const { google } = require('googleapis');
// const axios = require('axios');
// const router = express.Router();

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );

// // 1. Redirect to Google
// router.get('/google', (req, res) => {
//   const url = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     prompt: 'consent',
//     scope: [
//       'profile',
//       'email',
//       'https://www.googleapis.com/auth/calendar.readonly',
//     ],
//   });
//   res.redirect(url);
// });

// // 2. Google callback
// router.get('/google/callback', async (req, res) => {
//   const { code } = req.query;
//   try {
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     // Save refresh token to token map (just in memory for now)
//     const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
//     const { data: userInfo } = await oauth2.userinfo.get();

//     // Store token in memory (for demo) — later use DB
//     userTokens[userInfo.email] = tokens;

//     const redirectUrl = `http://localhost:5173/auth/callback/handler` +
//       `?token=${tokens.access_token}` +
//       `&name=${encodeURIComponent(userInfo.name)}` +
//       `&email=${encodeURIComponent(userInfo.email)}`;

//     res.redirect(redirectUrl);
//   } catch (err) {
//     console.error('Callback error:', err);
//     res.status(500).send('Authentication failed');
//   }
// });

// // 👇 TEMP in-memory token store
// const userTokens = {};

// const url = oauth2Client.generateAuthUrl({
//   access_type: 'offline',
//   prompt: 'consent',
//   scope: [
//     'https://www.googleapis.com/auth/calendar.readonly',
//     'https://www.googleapis.com/auth/userinfo.email',
//     'https://www.googleapis.com/auth/userinfo.profile',
//   ],
// });

// router.get('/google/callback', async (req, res) => {
//   const { code } = req.query;

//   try {
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
//     const { data: userInfo } = await oauth2.userinfo.get();

//     // Store token for use later (you can replace this with DB storage)
//     userTokens[userInfo.email] = tokens;

//     // Redirect back to frontend
//     const redirectUrl = `http://localhost:5173/auth/callback/handler` +
//       `?token=${tokens.access_token}` +
//       `&email=${encodeURIComponent(userInfo.email)}` +
//       `&name=${encodeURIComponent(userInfo.name)}`;

//     res.redirect(redirectUrl);
//   } catch (err) {
//     console.error('Callback error:', err.response?.data || err);
//     res.status(500).send('Google authentication failed');
//   }
// });
// router.get('/calendar/events', async (req, res) => {
//   const token = req.headers['x-google-token'];
//   if (!token) return res.status(401).json({ error: 'Missing Google token' });

//   try {
//     const response = await axios.get(
//       'https://www.googleapis.com/calendar/v3/calendars/primary/events',
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     res.json(response.data.items);
//   } catch (err) {
//     console.error('Google API error:', err.response?.data || err);
//     res.status(500).json({ error: 'Failed to fetch events' });
//   }
// });



// module.exports = router;
const express = require('express');
const axios = require('axios');
const { google } = require('googleapis');
const router = express.Router();

// 👇 In-memory store (replace with DB in production)
const userTokens = {};

// 👉 1. Setup OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// 👉 2. Redirect user to Google OAuth Consent Screen
router.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',             
    prompt: 'consent',                  
    scope: [
      'https://www.googleapis.com/auth/calendar',       
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

  res.redirect(url);
});

// 👉 3. Google OAuth callback
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // ✅ Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    // ✅ Store tokens in memory (or DB)
    userTokens[userInfo.email] = tokens;

    // ✅ Redirect back to frontend with access token
    const redirectUrl = `http://localhost:5173/auth/callback/handler` +
      `?token=${tokens.access_token}` +
      `&email=${encodeURIComponent(userInfo.email)}` +
      `&name=${encodeURIComponent(userInfo.name)}`;

    res.redirect(redirectUrl);
  } catch (err) {
    console.error('Callback error:', err.response?.data || err);
    res.status(500).send('Google authentication failed');
  }
});

// 👉 4. Fetch calendar events using access token
router.get('/calendar/events', async (req, res) => {
  const token = req.headers['x-google-token'];
  if (!token) return res.status(401).json({ error: 'Missing Google token' });
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  try {
    const response = await axios.get(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          timeMin: startOfMonth,
          timeMax: endOfMonth,
          singleEvents: true,
          orderBy: 'startTime',
        },
      }
    );

    res.json(response.data.items);
  } catch (err) {
    console.error('Google API error:', err.response?.data || err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.post('/calendar/events', async (req, res) => {
  const { title, start, end } = req.body;
  const googleAccessToken = req.headers['x-google-access-token'];

  if (!googleAccessToken) {
    return res.status(401).json({ error: 'Missing Google access token' });
  }

  try {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: googleAccessToken });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: title,
        start: { dateTime: start },
        end: { dateTime: end },
      },
    });

    return res.status(200).json({
      id: response.data.id,
      title,
      start,
      end,
    });
  } catch (err) {
    console.error('❌ Google Calendar error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to create calendar event' });
  }
});

module.exports = router;

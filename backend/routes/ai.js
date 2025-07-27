// route that handles /ai/plan
// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const { generatePlan } = require('../controllers/aiController');

router.post('/plan', generatePlan);

module.exports = router;

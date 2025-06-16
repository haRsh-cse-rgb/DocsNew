const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /api/v1/ai/analyze-cv - Analyze CV against job
router.post('/analyze-cv', aiController.analyzeCv);

module.exports = router;
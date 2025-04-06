const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { verifyToken } = require('../middleware/auth');

router.post('/suggest', verifyToken, async (req, res) => {
    try {
        const suggestions = await aiService.generateSuggestions(req.body.content);
        res.json({ suggestions });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate suggestions' });
    }
});

router.post('/summarize', verifyToken, async (req, res) => {
    try {
        const summary = await aiService.autoSummarize(req.body.content);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate summary' });
    }
});

module.exports = router; 
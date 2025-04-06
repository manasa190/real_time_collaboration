const express = require('express');
const router = express.Router();

// Mock database for demonstration purposes
const documents = [
    { _id: '1', title: 'Document 1', updatedAt: new Date() },
    { _id: '2', title: 'Document 2', updatedAt: new Date() },
];

// Route to get all documents
router.get('/api/documents', (req, res) => {
    res.json(documents);
});

// Route to get a specific document by ID
router.get('/api/documents/:id', (req, res) => {
    const document = documents.find((doc) => doc._id === req.params.id);
    if (document) {
        res.json(document);
    } else {
        res.status(404).json({ error: 'Document not found' });
    }
});

module.exports = router;

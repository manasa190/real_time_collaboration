const express = require('express');
const Document = require('../models/Document');
const { verifyToken } = require('../middleware/auth');
const DocumentVersion = require('../models/DocumentVersion');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Add debug log to check if verifyToken is a function
console.log('verifyToken type:', typeof verifyToken);

// Define the callback function first

const getAllDocuments = (req, res) => {
    Document.find({
        $or: [
            { owner: req.user.id },
            { collaborators: req.user.id }
        ]
    })
    .sort({ updatedAt: -1 })
    .then(documents => res.json(documents))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Now use the defined callback function
router.get('/', verifyToken, getAllDocuments);

// Get a single document by ID
router.get('/:id', verifyToken, (req, res) => {
    Document.findOne({
        _id: req.params.id,
        $or: [
            { owner: req.user.id },
            { collaborators: req.user.id }
        ]
    })
    .then(document => {
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document);
    })
    .catch(error => {
        console.error('Error fetching document:', error);
        res.status(500).json({ message: 'Error fetching document' });
    });
});

// Create a new document
router.post('/', verifyToken, (req, res) => {
    const document = new Document({
        title: req.body.title || 'Untitled Document',
        content: req.body.content || '',
        owner: req.user.id
    });

    document.save()
        .then(savedDoc => {
            res.status(201).json(savedDoc);
        })
        .catch(error => {
            console.error('Error creating document:', error);
            res.status(500).json({ message: 'Error creating document' });
        });
});

// Update a document
router.put('/:id', verifyToken, (req, res) => {
    Document.findOneAndUpdate(
        {
            _id: req.params.id,
            $or: [
                { owner: req.user.id },
                { collaborators: req.user.id }
            ]
        },
        {
            $set: {
                title: req.body.title,
                content: req.body.content,
                lastModified: Date.now()
            }
        },
        { new: true }
    )
    .then(document => {
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document);
    })
    .catch(error => {
        console.error('Error updating document:', error);
        res.status(500).json({ message: 'Error updating document' });
    });
});

// Delete a document
router.delete('/:id', verifyToken, (req, res) => {
    Document.findOneAndDelete({
        _id: req.params.id,
        owner: req.user.id
    })
    .then(document => {
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json({ message: 'Document deleted successfully' });
    })
    .catch(error => {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Error deleting document' });
    });
});

// Get document versions
router.get('/:id/versions', verifyToken, async (req, res) => {
    try {
        const versions = await DocumentVersion.find({ documentId: req.params.id })
            .sort({ createdAt: -1 });
        res.json(versions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Restore document version
router.post('/:id/restore/:versionId', verifyToken, async (req, res) => {
    try {
        const version = await DocumentVersion.findById(req.params.versionId);
        if (!version) {
            return res.status(404).json({ message: 'Version not found' });
        }

        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Save current version before restoring
        await DocumentVersion.create({
            documentId: document._id,
            content: document.content,
            modifiedBy: req.user.userId,
            versionNumber: document.version
        });

        // Restore the selected version
        document.content = version.content;
        document.version += 1;
        await document.save();

        res.json({ message: 'Version restored successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Share document
router.post('/:id/share', verifyToken, async (req, res) => {
    try {
        const { email, permission } = req.body;
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already shared
        const existingShare = document.sharedWith.find(
            share => share.user.toString() === user._id.toString()
        );

        if (existingShare) {
            existingShare.permission = permission;
        } else {
            document.sharedWith.push({ user: user._id, permission });
        }

        await document.save();
        res.json({ message: 'Document shared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get shared users
router.get('/:id/shared', verifyToken, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('sharedWith.user', 'email');
        
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.json(document.sharedWith);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove shared access
router.delete('/:id/shared/:userId', verifyToken, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        document.sharedWith = document.sharedWith.filter(
            share => share.user.toString() !== req.params.userId
        );

        await document.save();
        res.json({ message: 'Access removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Generate share link
router.post('/:id/share-link', verifyToken, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const token = jwt.sign(
            { documentId: document._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const link = `${process.env.FRONTEND_URL}/shared/${token}`;
        res.json({ link });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

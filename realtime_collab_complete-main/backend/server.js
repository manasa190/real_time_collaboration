const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const documentRoutes = require('./routes/documents');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api', apiRoutes);

// Added a fallback route to serve static files and handle unmatched routes for production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend-new/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend-new/build', 'index.html'));
    });
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_document', (documentId) => {
        socket.join(documentId);
        console.log(`User joined document: ${documentId}`);
    });

    socket.on('leave_document', (documentId) => {
        socket.leave(documentId);
        console.log(`User left document: ${documentId}`);
    });

    socket.on('document_update', (data) => {
        socket.to(data.documentId).emit('document_updated', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

    // Added backend support for WebRTC signaling and interactive object synchronization.
    socket.on('join_vr_meeting', () => {
        socket.broadcast.emit('user-connected', socket.id);
    });

    socket.on('leave_vr_meeting', () => {
        socket.broadcast.emit('user-disconnected', socket.id);
    });

    socket.on('object-move', (data) => {
        socket.broadcast.emit('object-move', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5002;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`WebSocket server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

# Real-time Collaborative Document Editor Platform

## Overview
A full-stack collaborative document editing platform with AI assistance, VR meetings, real-time translation, and data visualization capabilities.

## Features

### Core Features
- Real-time document collaboration
- User authentication and authorization
- Document version control
- Template management

### AI Assistant
- Grammar and style checking
- Content suggestions
- Automated formatting
- Context-aware recommendations

### VR Meeting Space
- Virtual meeting rooms
- Avatar-based interaction
- Spatial audio
- Document sharing in VR

### Translation Panel
- Real-time text translation
- Multiple language support
- Translation memory
- Language detection

### Data Visualization
- Interactive charts and graphs
- Real-time data updates
- Collaborative editing
- Export capabilities

## Technology Stack

### Frontend
- React.js
- Material-UI
- Three.js (VR)
- Socket.IO Client
- Recharts
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Socket.IO
- JWT Authentication

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```env
PORT=5002
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

4. Start server:
```bash
npm start
```

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend-new
```

Install additional required packages:
npm install react-dropzone react-color

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```env
REACT_APP_API_URL=http://localhost:5002
REACT_APP_WS_URL=http://localhost:5002
```

4. Start application:
```bash
npm start
```

## API Documentation

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/verify - Verify token

### Documents
- GET /api/documents - List documents
- POST /api/documents - Create document
- GET /api/documents/:id - Get document
- PUT /api/documents/:id - Update document
- DELETE /api/documents/:id - Delete document

### AI Assistant
- POST /api/ai/suggestions - Get AI suggestions

### Translation
- POST /api/translate - Translate text

### VR Meeting
- POST /api/vr/rooms - Create VR room
- GET /api/vr/rooms/:id - Get room details

### Data Visualization
- POST /api/visualizations - Create visualization
- GET /api/visualizations/:id - Get visualization data

## WebSocket Events

### Document Collaboration
- join-document: Join document editing session
- content-change: Real-time content updates
- cursor-move: Cursor position updates

### VR Meeting
- join-vr-room: Join virtual room
- avatar-move: Avatar position updates
- audio-data: Spatial audio streaming

### Real-time Translation
- translation-update: New translation available
- translation-received: Receive translation

### Data Visualization
- chart-update: Update chart data
- chart-updated: Receive chart updates

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License
MIT License

## Support
For support, email support@example.com or create an issue in the repository.
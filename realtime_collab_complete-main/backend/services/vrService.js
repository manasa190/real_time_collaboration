const WebSocket = require('ws');

class VRService {
    constructor() {
        this.rooms = new Map();
    }

    createRoom(roomId) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
        }
        return roomId;
    }

    joinRoom(roomId, userId, socket) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.add({ userId, socket });
            this.broadcastToRoom(roomId, {
                type: 'user-joined',
                userId
            });
        }
    }

    leaveRoom(roomId, userId) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.delete(userId);
            this.broadcastToRoom(roomId, {
                type: 'user-left',
                userId
            });
        }
    }

    broadcastToRoom(roomId, message) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.forEach(({ socket }) => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(message));
                }
            });
        }
    }

    updateUserPosition(roomId, userId, position) {
        this.broadcastToRoom(roomId, {
            type: 'position-update',
            userId,
            position
        });
    }
}

module.exports = new VRService();
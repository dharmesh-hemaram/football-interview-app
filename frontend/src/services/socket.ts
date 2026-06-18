import { io, Socket } from 'socket.io-client';
import type { Notification } from '@types/index';

let socket: Socket | null = null;

export const socketService = {
  connect: () => {
    socket = io('http://localhost:3001', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  subscribeLiveUpdates: (matchId: string) => {
    if (socket) {
      socket.emit('subscribe:liveUpdates', matchId);
    }
  },

  unsubscribeLiveUpdates: (matchId: string) => {
    if (socket) {
      socket.emit('unsubscribe:liveUpdates', matchId);
    }
  },

  onNotification: (callback: (notification: Notification) => void) => {
    if (socket) {
      socket.on('notification', callback);
    }
  },

  offNotification: (callback: (notification: Notification) => void) => {
    if (socket) {
      socket.off('notification', callback);
    }
  },

  getSocket: () => socket,
};

import { io, Socket } from 'socket.io-client';
import type { Notification } from '@types/index';
import { BACKEND_URL } from './backendUrl';

let socket: Socket | null = null;

export const socketService = {
  connect: () => {
    socket = io(BACKEND_URL, {
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
      // Register on current connection and re-register on every reconnect
      socket.on('notification', callback);
      socket.on('connect', () => {
        socket?.on('notification', callback);
      });
    }
  },

  offNotification: (callback: (notification: Notification) => void) => {
    if (socket) {
      socket.off('notification', callback);
    }
  },

  getSocket: () => socket,
};

import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import teamReducer from './slices/teamSlice';
import matchReducer from './slices/matchSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    players: playerReducer,
    teams: teamReducer,
    matches: matchReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

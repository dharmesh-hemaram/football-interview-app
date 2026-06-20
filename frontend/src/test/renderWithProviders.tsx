import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '@redux/slices/playerSlice';
import teamReducer from '@redux/slices/teamSlice';
import matchReducer from '@redux/slices/matchSlice';
import notificationReducer from '@redux/slices/notificationSlice';

export function createTestStore(preloadedState: Record<string, any> = {}) {
  return configureStore({
    reducer: {
      players: playerReducer,
      teams: teamReducer,
      matches: matchReducer,
      notifications: notificationReducer,
    },
    preloadedState,
  });
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Record<string, any>;
  initialRoute?: string;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState = {}, initialRoute = '/', ...renderOptions }: RenderWithProvidersOptions = {}
) {
  const store = createTestStore(preloadedState);

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

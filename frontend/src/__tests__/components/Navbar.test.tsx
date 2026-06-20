import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Navbar } from '@components/Navbar';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('Navbar', () => {
  it('renders the app brand', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText(/Football App/i)).toBeInTheDocument();
  });

  it('renders Teams nav link', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('link', { name: /teams/i })).toBeInTheDocument();
  });

  it('renders Matches nav link', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('link', { name: /matches/i })).toBeInTheDocument();
  });

  it('renders All Players nav link', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('link', { name: /all players/i })).toBeInTheDocument();
  });

  it('renders notification bell icon', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('🔔')).toBeInTheDocument();
  });

  it('does not show notification badge when unreadCount is 0', () => {
    renderWithProviders(<Navbar />, {
      preloadedState: { notifications: { notifications: [], unreadCount: 0 } },
    });
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('shows notification badge when there are unread notifications', () => {
    renderWithProviders(<Navbar />, {
      preloadedState: { notifications: { notifications: [], unreadCount: 3 } },
    });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('Teams link has correct href', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('link', { name: /teams/i })).toHaveAttribute('href', '/teams');
  });

  it('Matches link has correct href', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('link', { name: /matches/i })).toHaveAttribute('href', '/matches');
  });
});

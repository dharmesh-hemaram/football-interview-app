import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { MatchesPage } from '@pages/MatchesPage';
import { renderWithProviders } from '../../test/renderWithProviders';

vi.mock('@services/api', () => ({
  matchService: {
    getAll: vi.fn().mockResolvedValue([]),
    getById: vi.fn(),
    update: vi.fn(),
  },
  teamService: {
    getAll: vi.fn().mockResolvedValue([]),
    getById: vi.fn(),
    update: vi.fn(),
  },
  playerService: {
    getAll: vi.fn().mockResolvedValue([]),
    getById: vi.fn(),
    update: vi.fn(),
  },
}));

const mockTeams = [
  { id: 'team-ars', name: 'Arsenal FC', shortName: 'Arsenal', logo: '', country: 'England', founded: 1886, stadium: 'Emirates Stadium', wins: 26, losses: 7, draws: 5, goalsDifference: 43 },
  { id: 'team-che', name: 'Chelsea FC', shortName: 'Chelsea', logo: '', country: 'England', founded: 1905, stadium: 'Stamford Bridge', wins: 18, losses: 12, draws: 8, goalsDifference: 20 },
  { id: 'team-lfc', name: 'Liverpool FC', shortName: 'Liverpool', logo: '', country: 'England', founded: 1892, stadium: 'Anfield', wins: 28, losses: 5, draws: 5, goalsDifference: 52 },
];

const mockMatches: any[] = [
  {
    id: 'match-1',
    homeTeamId: 'team-ars',
    awayTeamId: 'team-che',
    date: '2025-01-14T20:00:00.000Z',
    status: 'completed',
    homeScore: 2,
    awayScore: 1,
    events: [
      { id: 'e1-1', type: 'goal', minute: 18, playerId: 'player-a6', teamId: 'team-ars' },
      { id: 'e1-2', type: 'yellow_card', minute: 34, playerId: 'player-c4', teamId: 'team-che' },
    ],
  },
  {
    id: 'match-5',
    homeTeamId: 'team-ars',
    awayTeamId: 'team-lfc',
    date: new Date().toISOString(),
    status: 'live',
    homeScore: 1,
    awayScore: 1,
    events: [
      { id: 'e5-1', type: 'goal', minute: 22, playerId: 'player-a6', teamId: 'team-ars' },
    ],
  },
];

const preloadedState = {
  matches: { list: mockMatches, selectedMatch: null, loading: false, error: null },
  teams: { list: mockTeams, selectedTeam: null, loading: false, error: null },
};

describe('MatchesPage', () => {
  it('renders the page heading', () => {
    renderWithProviders(<MatchesPage />, { preloadedState });
    expect(screen.getByText('Matches')).toBeInTheDocument();
  });

  it('renders team names from the store', () => {
    renderWithProviders(<MatchesPage />, { preloadedState });
    expect(screen.getAllByText('Arsenal FC').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Chelsea FC')).toBeInTheDocument();
  });

  it('renders COMPLETED badge for finished matches', () => {
    renderWithProviders(<MatchesPage />, { preloadedState });
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
  });

  it('renders LIVE badge for live matches', () => {
    renderWithProviders(<MatchesPage />, { preloadedState });
    expect(screen.getByText('🔴 LIVE')).toBeInTheDocument();
  });

  it('renders the score for completed matches', () => {
    renderWithProviders(<MatchesPage />, { preloadedState });
    expect(screen.getByText('2 – 1')).toBeInTheDocument();
  });

  it('shows event icons in match cards', () => {
    renderWithProviders(<MatchesPage />, { preloadedState });
    expect(screen.getByText("⚽ 18'")).toBeInTheDocument();
    expect(screen.getByText("🟨 34'")).toBeInTheDocument();
  });

  it('shows empty state when no matches', async () => {
    renderWithProviders(<MatchesPage />, {
      preloadedState: {
        matches: { list: [], selectedMatch: null, loading: false, error: null },
        teams: { list: mockTeams, selectedTeam: null, loading: false, error: null },
      },
    });
    await waitFor(() => {
      expect(screen.getByText(/no matches found/i)).toBeInTheDocument();
    });
  });

  it('shows loading spinner when loading', () => {
    renderWithProviders(<MatchesPage />, {
      preloadedState: {
        matches: { list: [], selectedMatch: null, loading: true, error: null },
        teams: { list: [], selectedTeam: null, loading: false, error: null },
      },
    });
    expect(screen.getAllByText(/loading matches/i).length).toBeGreaterThan(0);
  });

  it('shows Home and Away labels', () => {
    renderWithProviders(<MatchesPage />, { preloadedState });
    const homeLabels = screen.getAllByText('Home');
    const awayLabels = screen.getAllByText('Away');
    expect(homeLabels.length).toBeGreaterThanOrEqual(2);
    expect(awayLabels.length).toBeGreaterThanOrEqual(2);
  });
});

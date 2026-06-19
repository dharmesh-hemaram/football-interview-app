import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { TeamsPage } from '@pages/TeamsPage';
import { renderWithProviders } from '../../test/renderWithProviders';

const mockTeams = [
  {
    id: 'team-ars',
    name: 'Arsenal FC',
    shortName: 'Arsenal',
    logo: 'https://crests.football-data.org/57.svg',
    country: 'England',
    founded: 1886,
    stadium: 'Emirates Stadium',
    wins: 26,
    losses: 7,
    draws: 5,
    goalsDifference: 43,
  },
  {
    id: 'team-lfc',
    name: 'Liverpool FC',
    shortName: 'Liverpool',
    logo: 'https://crests.football-data.org/64.svg',
    country: 'England',
    founded: 1892,
    stadium: 'Anfield',
    wins: 28,
    losses: 5,
    draws: 5,
    goalsDifference: 52,
  },
];

vi.mock('@services/api', () => ({
  teamService: {
    getAll: vi.fn().mockResolvedValue([
      { id: 'team-ars', name: 'Arsenal FC', shortName: 'Arsenal', logo: 'https://crests.football-data.org/57.svg', country: 'England', founded: 1886, stadium: 'Emirates Stadium', wins: 26, losses: 7, draws: 5, goalsDifference: 43 },
      { id: 'team-lfc', name: 'Liverpool FC', shortName: 'Liverpool', logo: 'https://crests.football-data.org/64.svg', country: 'England', founded: 1892, stadium: 'Anfield', wins: 28, losses: 5, draws: 5, goalsDifference: 52 },
    ]),
    getById: vi.fn(),
    update: vi.fn(),
  },
  playerService: {
    getAll: vi.fn().mockResolvedValue([]),
    getById: vi.fn(),
    update: vi.fn(),
  },
  matchService: {
    getAll: vi.fn().mockResolvedValue([]),
    getById: vi.fn(),
    update: vi.fn(),
  },
}));

import { teamService } from '@services/api';

describe('TeamsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(teamService.getAll).mockResolvedValue(mockTeams);
  });

  it('renders the page heading', async () => {
    renderWithProviders(<TeamsPage />);
    await waitFor(() => {
      expect(screen.getByText('Premier League Clubs')).toBeInTheDocument();
    });
  });

  it('shows loading spinner initially then teams', async () => {
    renderWithProviders(<TeamsPage />);
    await waitFor(() => {
      expect(screen.getByText('Arsenal FC')).toBeInTheDocument();
    });
  });

  it('renders team name and stadium', async () => {
    renderWithProviders(<TeamsPage />);
    await waitFor(() => {
      expect(screen.getByText('Emirates Stadium')).toBeInTheDocument();
    });
  });

  it('renders all teams from store', () => {
    renderWithProviders(<TeamsPage />, {
      preloadedState: {
        teams: { list: mockTeams, selectedTeam: null, loading: false, error: null },
      },
    });
    expect(screen.getByText('Arsenal FC')).toBeInTheDocument();
    expect(screen.getByText('Liverpool FC')).toBeInTheDocument();
  });

  it('renders W/D/L badges for each team', () => {
    renderWithProviders(<TeamsPage />, {
      preloadedState: {
        teams: { list: mockTeams, selectedTeam: null, loading: false, error: null },
      },
    });
    expect(screen.getByText('W 26')).toBeInTheDocument();
    expect(screen.getByText('L 7')).toBeInTheDocument();
    expect(screen.getAllByText('D 5').length).toBeGreaterThanOrEqual(1);
  });

  it('shows empty state when no teams', async () => {
    vi.mocked(teamService.getAll).mockResolvedValueOnce([]);
    renderWithProviders(<TeamsPage />, {
      preloadedState: {
        teams: { list: [], selectedTeam: null, loading: false, error: null },
      },
    });
    await waitFor(() => {
      expect(screen.getByText(/no teams found/i)).toBeInTheDocument();
    });
  });

  it('shows loading spinner when loading is true', () => {
    renderWithProviders(<TeamsPage />, {
      preloadedState: {
        teams: { list: [], selectedTeam: null, loading: true, error: null },
      },
    });
    expect(screen.getAllByText(/loading teams/i).length).toBeGreaterThan(0);
  });

  it('renders points calculation correctly (W×3 + D)', () => {
    renderWithProviders(<TeamsPage />, {
      preloadedState: {
        teams: { list: mockTeams, selectedTeam: null, loading: false, error: null },
      },
    });
    // Arsenal: 26*3 + 5 = 83 pts
    expect(screen.getByText('83')).toBeInTheDocument();
  });
});

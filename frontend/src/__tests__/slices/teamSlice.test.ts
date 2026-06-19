import { describe, it, expect } from 'vitest';
import teamReducer, {
  teamActions,
  selectTeams,
  selectSelectedTeam,
  selectTeamsLoading,
  selectTeamsError,
  selectTeamsByCountry,
  fetchTeams,
  fetchTeamById,
  updateTeam,
} from '@redux/slices/teamSlice';

const mockTeam = {
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
};

const mockTeam2 = {
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
};

describe('teamSlice reducers', () => {
  const initialState = {
    list: [],
    selectedTeam: null,
    loading: false,
    error: null,
  };

  it('returns the initial state', () => {
    expect(teamReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('clearSelectedTeam sets selectedTeam to null', () => {
    const state = { ...initialState, selectedTeam: mockTeam };
    const result = teamReducer(state, teamActions.clearSelectedTeam());
    expect(result.selectedTeam).toBeNull();
  });

  it('clearError sets error to null', () => {
    const state = { ...initialState, error: 'Failed to fetch' };
    const result = teamReducer(state, teamActions.clearError());
    expect(result.error).toBeNull();
  });

  it('fetchTeams.pending sets loading true', () => {
    const result = teamReducer(initialState, fetchTeams.pending('', undefined));
    expect(result.loading).toBe(true);
  });

  it('fetchTeams.fulfilled populates list', () => {
    const result = teamReducer(
      { ...initialState, loading: true },
      fetchTeams.fulfilled([mockTeam, mockTeam2], '', undefined)
    );
    expect(result.loading).toBe(false);
    expect(result.list).toHaveLength(2);
    expect(result.list[0].shortName).toBe('Arsenal');
  });

  it('fetchTeams.rejected sets error', () => {
    const result = teamReducer(
      { ...initialState, loading: true },
      fetchTeams.rejected(new Error('API down'), '', undefined)
    );
    expect(result.loading).toBe(false);
    expect(result.error).toBe('API down');
  });

  it('fetchTeamById.fulfilled sets selectedTeam', () => {
    const result = teamReducer(
      initialState,
      fetchTeamById.fulfilled(mockTeam, '', 'team-ars')
    );
    expect(result.selectedTeam).toEqual(mockTeam);
  });

  it('updateTeam.fulfilled updates in list and selectedTeam', () => {
    const updated = { ...mockTeam, wins: 30 };
    const state = { ...initialState, list: [mockTeam, mockTeam2], selectedTeam: mockTeam };
    const result = teamReducer(
      state,
      updateTeam.fulfilled(updated, '', { id: 'team-ars', data: { wins: 30 } })
    );
    expect(result.list[0].wins).toBe(30);
    expect(result.selectedTeam?.wins).toBe(30);
    expect(result.list[1].wins).toBe(28); // unchanged
  });
});

describe('teamSlice selectors', () => {
  const storeState = {
    teams: {
      list: [mockTeam, mockTeam2],
      selectedTeam: mockTeam,
      loading: false,
      error: null,
    },
  };

  it('selectTeams returns the list', () => {
    expect(selectTeams(storeState)).toHaveLength(2);
  });

  it('selectSelectedTeam returns the selected team', () => {
    expect(selectSelectedTeam(storeState)).toEqual(mockTeam);
  });

  it('selectTeamsLoading returns false', () => {
    expect(selectTeamsLoading(storeState)).toBe(false);
  });

  it('selectTeamsError returns null', () => {
    expect(selectTeamsError(storeState)).toBeNull();
  });

  it('selectTeamsByCountry filters by country', () => {
    const english = selectTeamsByCountry(storeState, 'England');
    expect(english).toHaveLength(2);
  });

  it('selectTeamsByCountry returns empty for unknown country', () => {
    expect(selectTeamsByCountry(storeState, 'Spain')).toHaveLength(0);
  });
});

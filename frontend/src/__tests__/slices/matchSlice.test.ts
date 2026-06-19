import { describe, it, expect } from 'vitest';
import matchReducer, {
  matchActions,
  selectMatches,
  selectSelectedMatch,
  selectMatchesLoading,
  selectMatchesError,
  selectMatchesByStatus,
  selectMatchesByTeam,
  fetchMatches,
  fetchMatchById,
  updateMatch,
} from '@redux/slices/matchSlice';

const mockMatch: any = {
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
};

const mockLiveMatch: any = {
  id: 'match-5',
  homeTeamId: 'team-ars',
  awayTeamId: 'team-lfc',
  date: new Date().toISOString(),
  status: 'live',
  homeScore: 1,
  awayScore: 1,
  events: [
    { id: 'e5-1', type: 'goal', minute: 22, playerId: 'player-a6', teamId: 'team-ars' },
    { id: 'e5-2', type: 'goal', minute: 55, playerId: 'player-l6', teamId: 'team-lfc' },
  ],
};

describe('matchSlice reducers', () => {
  const initialState = {
    list: [],
    selectedMatch: null,
    loading: false,
    error: null,
  };

  it('returns the initial state', () => {
    expect(matchReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('clearSelectedMatch sets selectedMatch to null', () => {
    const state = { ...initialState, selectedMatch: mockMatch };
    const result = matchReducer(state, matchActions.clearSelectedMatch());
    expect(result.selectedMatch).toBeNull();
  });

  it('clearError sets error to null', () => {
    const state = { ...initialState, error: 'Failed' };
    const result = matchReducer(state, matchActions.clearError());
    expect(result.error).toBeNull();
  });

  it('fetchMatches.pending sets loading true', () => {
    const result = matchReducer(initialState, fetchMatches.pending('', undefined));
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('fetchMatches.fulfilled populates list', () => {
    const result = matchReducer(
      { ...initialState, loading: true },
      fetchMatches.fulfilled([mockMatch, mockLiveMatch], '', undefined)
    );
    expect(result.loading).toBe(false);
    expect(result.list).toHaveLength(2);
  });

  it('fetchMatches.rejected sets error', () => {
    const result = matchReducer(
      { ...initialState, loading: true },
      fetchMatches.rejected(new Error('Timeout'), '', undefined)
    );
    expect(result.loading).toBe(false);
    expect(result.error).toBe('Timeout');
  });

  it('fetchMatchById.fulfilled sets selectedMatch', () => {
    const result = matchReducer(
      initialState,
      fetchMatchById.fulfilled(mockMatch, '', 'match-1')
    );
    expect(result.selectedMatch).toEqual(mockMatch);
  });

  it('updateMatch.fulfilled updates in list and selectedMatch', () => {
    const updated = { ...mockLiveMatch, homeScore: 2, status: 'completed' };
    const state = { ...initialState, list: [mockMatch, mockLiveMatch], selectedMatch: mockLiveMatch };
    const result = matchReducer(
      state,
      updateMatch.fulfilled(updated, '', { id: 'match-5', data: { homeScore: 2 } })
    );
    expect(result.list[1].homeScore).toBe(2);
    expect(result.selectedMatch?.homeScore).toBe(2);
    expect(result.list[0].homeScore).toBe(2); // original match-1 unchanged in score
  });
});

describe('matchSlice selectors', () => {
  const storeState = {
    matches: {
      list: [mockMatch, mockLiveMatch],
      selectedMatch: mockMatch,
      loading: false,
      error: null,
    },
  };

  it('selectMatches returns the list', () => {
    expect(selectMatches(storeState)).toHaveLength(2);
  });

  it('selectSelectedMatch returns the selected match', () => {
    expect(selectSelectedMatch(storeState)).toEqual(mockMatch);
  });

  it('selectMatchesLoading returns false', () => {
    expect(selectMatchesLoading(storeState)).toBe(false);
  });

  it('selectMatchesError returns null', () => {
    expect(selectMatchesError(storeState)).toBeNull();
  });

  it('selectMatchesByStatus filters completed matches', () => {
    const completed = selectMatchesByStatus(storeState, 'completed');
    expect(completed).toHaveLength(1);
    expect(completed[0].id).toBe('match-1');
  });

  it('selectMatchesByStatus filters live matches', () => {
    const live = selectMatchesByStatus(storeState, 'live');
    expect(live).toHaveLength(1);
    expect(live[0].id).toBe('match-5');
  });

  it('selectMatchesByTeam returns matches for Arsenal', () => {
    const arsMatches = selectMatchesByTeam(storeState, 'team-ars');
    expect(arsMatches).toHaveLength(2); // match-1 (home) and match-5 (home)
  });

  it('selectMatchesByTeam returns matches for Liverpool (away only in this set)', () => {
    const lfcMatches = selectMatchesByTeam(storeState, 'team-lfc');
    expect(lfcMatches).toHaveLength(1);
    expect(lfcMatches[0].id).toBe('match-5');
  });

  it('selectMatchesByTeam returns empty for unknown team', () => {
    expect(selectMatchesByTeam(storeState, 'team-xyz')).toHaveLength(0);
  });
});

describe('match events structure', () => {
  it('match events have correct shape', () => {
    const events = mockMatch.events;
    expect(events[0]).toHaveProperty('id');
    expect(events[0]).toHaveProperty('type');
    expect(events[0]).toHaveProperty('minute');
    expect(events[0]).toHaveProperty('playerId');
    expect(events[0]).toHaveProperty('teamId');
  });

  it('goal event has type goal', () => {
    expect(mockMatch.events[0].type).toBe('goal');
    expect(mockMatch.events[0].minute).toBe(18);
  });

  it('yellow card event has type yellow_card', () => {
    expect(mockMatch.events[1].type).toBe('yellow_card');
    expect(mockMatch.events[1].minute).toBe(34);
  });
});

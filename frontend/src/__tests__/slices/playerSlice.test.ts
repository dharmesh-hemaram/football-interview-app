import { describe, it, expect } from 'vitest';
import playerReducer, {
  playerActions,
  selectPlayers,
  selectSelectedPlayer,
  selectPlayersLoading,
  selectPlayersError,
  selectPlayersByTeam,
  fetchPlayers,
  fetchPlayerById,
  updatePlayer,
} from '@redux/slices/playerSlice';

const mockPlayer = {
  id: 'player-a6',
  name: 'Bukayo Saka',
  position: 'FWD' as const,
  teamId: 'team-ars',
  nationality: 'England',
  goals: 14,
  assists: 11,
  matches: 29,
  jerseyNumber: 7,
  yellowCards: 2,
  redCards: 0,
};

const mockPlayer2 = {
  id: 'player-l6',
  name: 'Mohamed Salah',
  position: 'FWD' as const,
  teamId: 'team-lfc',
  nationality: 'Egypt',
  goals: 28,
  assists: 17,
  matches: 31,
  jerseyNumber: 11,
  yellowCards: 1,
  redCards: 0,
};

describe('playerSlice reducers', () => {
  const initialState = {
    list: [],
    selectedPlayer: null,
    loading: false,
    error: null,
  };

  it('returns the initial state', () => {
    expect(playerReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('clearSelectedPlayer sets selectedPlayer to null', () => {
    const state = { ...initialState, selectedPlayer: mockPlayer };
    const result = playerReducer(state, playerActions.clearSelectedPlayer());
    expect(result.selectedPlayer).toBeNull();
  });

  it('clearError sets error to null', () => {
    const state = { ...initialState, error: 'Something went wrong' };
    const result = playerReducer(state, playerActions.clearError());
    expect(result.error).toBeNull();
  });

  it('fetchPlayers.pending sets loading true', () => {
    const result = playerReducer(initialState, fetchPlayers.pending('', undefined));
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('fetchPlayers.fulfilled populates list and stops loading', () => {
    const result = playerReducer(
      { ...initialState, loading: true },
      fetchPlayers.fulfilled([mockPlayer, mockPlayer2], '', undefined)
    );
    expect(result.loading).toBe(false);
    expect(result.list).toHaveLength(2);
    expect(result.list[0].name).toBe('Bukayo Saka');
  });

  it('fetchPlayers.rejected sets error message', () => {
    const result = playerReducer(
      { ...initialState, loading: true },
      fetchPlayers.rejected(new Error('Network error'), '', undefined)
    );
    expect(result.loading).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('fetchPlayerById.fulfilled sets selectedPlayer', () => {
    const result = playerReducer(
      initialState,
      fetchPlayerById.fulfilled(mockPlayer, '', 'player-a6')
    );
    expect(result.selectedPlayer).toEqual(mockPlayer);
  });

  it('updatePlayer.fulfilled updates player in list', () => {
    const updatedPlayer = { ...mockPlayer, goals: 20 };
    const state = { ...initialState, list: [mockPlayer, mockPlayer2] };
    const result = playerReducer(
      state,
      updatePlayer.fulfilled(updatedPlayer, '', { id: 'player-a6', data: { goals: 20 } })
    );
    expect(result.list[0].goals).toBe(20);
    expect(result.list[1].goals).toBe(28); // unchanged
  });

  it('updatePlayer.fulfilled also updates selectedPlayer if it matches', () => {
    const updatedPlayer = { ...mockPlayer, goals: 20 };
    const state = { ...initialState, list: [mockPlayer], selectedPlayer: mockPlayer };
    const result = playerReducer(
      state,
      updatePlayer.fulfilled(updatedPlayer, '', { id: 'player-a6', data: { goals: 20 } })
    );
    expect(result.selectedPlayer?.goals).toBe(20);
  });
});

describe('playerSlice selectors', () => {
  const storeState = {
    players: {
      list: [mockPlayer, mockPlayer2],
      selectedPlayer: mockPlayer,
      loading: false,
      error: null,
    },
  };

  it('selectPlayers returns the list', () => {
    expect(selectPlayers(storeState)).toHaveLength(2);
  });

  it('selectSelectedPlayer returns the selected player', () => {
    expect(selectSelectedPlayer(storeState)).toEqual(mockPlayer);
  });

  it('selectPlayersLoading returns false', () => {
    expect(selectPlayersLoading(storeState)).toBe(false);
  });

  it('selectPlayersError returns null', () => {
    expect(selectPlayersError(storeState)).toBeNull();
  });

  it('selectPlayersByTeam filters by teamId', () => {
    const arsPlayers = selectPlayersByTeam(storeState, 'team-ars');
    expect(arsPlayers).toHaveLength(1);
    expect(arsPlayers[0].name).toBe('Bukayo Saka');
  });

  it('selectPlayersByTeam returns empty array for unknown team', () => {
    expect(selectPlayersByTeam(storeState, 'team-unknown')).toHaveLength(0);
  });
});

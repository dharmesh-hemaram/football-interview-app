import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Player } from '@types/index';
import { playerService } from '@services/api';

interface PlayerState {
  list: Player[];
  selectedPlayer: Player | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  list: [],
  selectedPlayer: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPlayers = createAsyncThunk('players/fetchAll', async () => {
  return playerService.getAll();
});

export const fetchPlayerById = createAsyncThunk(
  'players/fetchById',
  async (id: string) => {
    return playerService.getById(id);
  }
);

export const updatePlayer = createAsyncThunk(
  'players/update',
  async ({ id, data }: { id: string; data: Partial<Player> }) => {
    return playerService.update(id, data);
  }
);

const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    clearSelectedPlayer: (state) => {
      state.selectedPlayer = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all players
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch players';
      });

    // Fetch player by ID
    builder
      .addCase(fetchPlayerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlayer = action.payload;
      })
      .addCase(fetchPlayerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch player';
      });

    // Update player
    builder
      .addCase(updatePlayer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlayer.fulfilled, (state, action) => {
        state.loading = false;
        // Update in list
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        // Update selected player if it's the one being edited
        if (state.selectedPlayer?.id === action.payload.id) {
          state.selectedPlayer = action.payload;
        }
      })
      .addCase(updatePlayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update player';
      });
  },
});

// Selectors
export const selectPlayers = (state: any) => state.players.list;
export const selectSelectedPlayer = (state: any) => state.players.selectedPlayer;
export const selectPlayersLoading = (state: any) => state.players.loading;
export const selectPlayersError = (state: any) => state.players.error;
export const selectPlayersByTeam = (state: any, teamId: string) =>
  state.players.list.filter((p: Player) => p.teamId === teamId);

export const playerActions = playerSlice.actions;
export default playerSlice.reducer;

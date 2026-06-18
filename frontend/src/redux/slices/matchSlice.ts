import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Match } from '@types/index';
import { matchService } from '@services/api';

interface MatchState {
  list: Match[];
  selectedMatch: Match | null;
  loading: boolean;
  error: string | null;
}

const initialState: MatchState = {
  list: [],
  selectedMatch: null,
  loading: false,
  error: null,
};

export const fetchMatches = createAsyncThunk('matches/fetchAll', async () => {
  return matchService.getAll();
});

export const fetchMatchById = createAsyncThunk(
  'matches/fetchById',
  async (id: string) => {
    return matchService.getById(id);
  }
);

export const updateMatch = createAsyncThunk(
  'matches/update',
  async ({ id, data }: { id: string; data: Partial<Match> }) => {
    return matchService.update(id, data);
  }
);

const matchSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    clearSelectedMatch: (state) => {
      state.selectedMatch = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch matches';
      });

    builder
      .addCase(fetchMatchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMatch = action.payload;
      })
      .addCase(fetchMatchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch match';
      });

    builder
      .addCase(updateMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMatch.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.selectedMatch?.id === action.payload.id) {
          state.selectedMatch = action.payload;
        }
      })
      .addCase(updateMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update match';
      });
  },
});

export const selectMatches = (state: any) => state.matches.list;
export const selectSelectedMatch = (state: any) => state.matches.selectedMatch;
export const selectMatchesLoading = (state: any) => state.matches.loading;
export const selectMatchesError = (state: any) => state.matches.error;
export const selectMatchesByStatus = (state: any, status: Match['status']) =>
  state.matches.list.filter((m: Match) => m.status === status);

export const matchActions = matchSlice.actions;
export default matchSlice.reducer;

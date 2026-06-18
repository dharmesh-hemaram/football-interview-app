import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Team } from '@types/index';
import { teamService } from '@services/api';

interface TeamState {
  list: Team[];
  selectedTeam: Team | null;
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  list: [],
  selectedTeam: null,
  loading: false,
  error: null,
};

export const fetchTeams = createAsyncThunk('teams/fetchAll', async () => {
  return teamService.getAll();
});

export const fetchTeamById = createAsyncThunk(
  'teams/fetchById',
  async (id: string) => {
    return teamService.getById(id);
  }
);

export const updateTeam = createAsyncThunk(
  'teams/update',
  async ({ id, data }: { id: string; data: Partial<Team> }) => {
    return teamService.update(id, data);
  }
);

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearSelectedTeam: (state) => {
      state.selectedTeam = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teams';
      });

    builder
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeam = action.payload;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch team';
      });

    builder
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.selectedTeam?.id === action.payload.id) {
          state.selectedTeam = action.payload;
        }
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update team';
      });
  },
});

export const selectTeams = (state: any) => state.teams.list;
export const selectSelectedTeam = (state: any) => state.teams.selectedTeam;
export const selectTeamsLoading = (state: any) => state.teams.loading;
export const selectTeamsError = (state: any) => state.teams.error;
export const selectTeamsByCountry = (state: any, country: string) =>
  state.teams.list.filter((t: Team) => t.country === country);

export const teamActions = teamSlice.actions;
export default teamSlice.reducer;

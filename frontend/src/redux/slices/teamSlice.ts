import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Team } from '@types/index';
// TODO: Import teamService once it's implemented
// import { teamService } from '@services/api';

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

// TODO: Create async thunks following the playerSlice pattern:
// - fetchTeams
// - fetchTeamById
// - updateTeam

// Example structure (uncomment and complete):
// export const fetchTeams = createAsyncThunk('teams/fetchAll', async () => {
//   return teamService.getAll();
// });

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    // TODO: Add reducers
    // clearSelectedTeam: (state) => { ... },
    // clearError: (state) => { ... },
  },
  extraReducers: (builder) => {
    // TODO: Add extra reducers for async thunks
    // Follow the playerSlice pattern
  },
});

// TODO: Add selectors
// export const selectTeams = (state: any) => state.teams.list;
// export const selectSelectedTeam = (state: any) => state.teams.selectedTeam;
// etc.

export const teamActions = teamSlice.actions;
export default teamSlice.reducer;

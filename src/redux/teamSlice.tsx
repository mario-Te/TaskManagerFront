import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import axios from 'axios';
import { Member } from './memberSlice';

export interface Team {
  _id?: string;
  name: string;
  description: string;
  members?: Member[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamState {
  teams: Team[];
  userTeams: Team[]; // Separate array for teams the user participates in
  loading: boolean;
  error: string | null;
  currentTeam: Team | null;
  userTeamsLoading: boolean;
  userTeamsError: string | null;
}

const API_BASE_URL = "http://localhost:3000/teams/";

const initialState: TeamState = {
  teams: [],
  userTeams: [],
  loading: false,
  error: null,
  currentTeam: null,
  userTeamsLoading: false,
  userTeamsError: null,
};

// API calls
const fetchTeamsAPI = async (): Promise<Team[]> => {
  const response = await axios.get(API_BASE_URL, { withCredentials: true });
  return response.data;
};

const fetchUserTeamsAPI = async (): Promise<Team[]> => {
  const response = await axios.get(`${API_BASE_URL}my-teams`, { withCredentials: true });
  return response.data;
};

const createTeamAPI = async (teamData: Omit<Team, '_id' | 'createdAt' | 'updatedAt'>): Promise<Team> => {
  const response = await axios.post(API_BASE_URL, teamData, { withCredentials: true });
  return response.data;
};

const updateTeamAPI = async ({ id, teamData }: { id: string; teamData: Partial<Team> }): Promise<Team> => {
  const response = await axios.patch(`${API_BASE_URL}${id}`, teamData, { withCredentials: true });
  return response.data;
};

const deleteTeamAPI = async (id: string): Promise<string> => {
  await axios.delete(`${API_BASE_URL}${id}`, { withCredentials: true });
  return id;
};

// Async Thunks
export const fetchTeams = createAsyncThunk<Team[], void, { state: RootState }>(
  'teams/fetchTeams',
  async () => {
    return await fetchTeamsAPI();
  }
);

export const fetchUserTeams = createAsyncThunk<Team[], void, { state: RootState }>(
  'teams/fetchUserTeams',
  async () => {
    return await fetchUserTeamsAPI();
  }
);

export const createTeam = createAsyncThunk<Team, Omit<Team, '_id' | 'createdAt' | 'updatedAt'>, { state: RootState }>(
  'teams/createTeam',
  async (teamData) => {
    return await createTeamAPI(teamData);
  }
);
export const createTeamMember = createAsyncThunk(
    'teams/createTeamMember',
    async ({ teamId, userId }: { teamId: string; userId: string[] }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/members`, { teamId,userIds:userId }, { 
          withCredentials: true 
        });
        return response.data;
      } catch (error:any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add team member');
      }
    }
  );

export const updateTeam = createAsyncThunk<Team, { id: string; teamData: Partial<Team> }, { state: RootState }>(
  'teams/updateTeam',
  async ({ id, teamData }) => {
    return await updateTeamAPI({ id, teamData });
  }
);

export const deleteTeam = createAsyncThunk<string, string, { state: RootState }>(
  'teams/deleteTeam',
  async (id) => {
    return await deleteTeamAPI(id);
  }
);

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setCurrentTeam: (state, action: PayloadAction<Team | null>) => {
      state.currentTeam = action.payload;
    },
    resetTeamState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Teams
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action: PayloadAction<Team[]>) => {
       
        state.loading = false;
        state.teams = action.payload as Team[]; 
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teams';
      })
      
      // Fetch User's Teams
      .addCase(fetchUserTeams.pending, (state) => {
        state.userTeamsLoading = true;
        state.userTeamsError = null;
      })
      .addCase(fetchUserTeams.fulfilled, (state, action: PayloadAction<Team[]>) => {
        state.userTeamsLoading = false;
        state.userTeams = action.payload;
      })
      .addCase(fetchUserTeams.rejected, (state, action) => {
        state.userTeamsLoading = false;
        state.userTeamsError = action.error.message || 'Failed to fetch user teams';
      })
      
      // Create Team
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action: PayloadAction<Team>) => {
        state.loading = false;
        state.teams.push(action.payload);
        state.userTeams.push(action.payload); // Also add to userTeams if creator is automatically a member
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create team';
      })
      
      // Update Team
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action: PayloadAction<Team>) => {
        state.loading = false;
        const updateTeamInArray = (teams: Team[]) => {
          const index = teams.findIndex(team => team._id === action.payload._id);
          if (index !== -1) {
            teams[index] = action.payload;
          }
          return teams;
        };
        
        state.teams = updateTeamInArray(state.teams);
        state.userTeams = updateTeamInArray(state.userTeams);
        state.currentTeam = null;
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update team';
      })
      
      // Delete Team
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.teams = state.teams.filter(team => team._id !== action.payload);
        state.userTeams = state.userTeams.filter(team => team._id !== action.payload);
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete team';
      });
  },
});

// Selectors
export const selectTeams = (state: RootState) => state.teams.teams;
export const selectUserTeams = (state: RootState) => state.teams.userTeams;
export const selectTeamsLoading = (state: RootState) => state.teams.loading;
export const selectUserTeamsLoading = (state: RootState) => state.teams.userTeamsLoading;
export const selectTeamsError = (state: RootState) => state.teams.error;
export const selectUserTeamsError = (state: RootState) => state.teams.userTeamsError;
export const selectCurrentTeam = (state: RootState) => state.teams.currentTeam;

// Actions
export const { setCurrentTeam, resetTeamState } = teamSlice.actions;

export default teamSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = "http://localhost:3000/";

export interface Member {
    _id?: string;
    email: string;
    name: string;
    team?: string
}

interface MembersState {
    allMembers: {
        members: Member[];
        loading: boolean;
        error: string | null;
    };
    teamMembers: {
        members: Member[];
        loading: boolean;
        error: string | null;
    };
}

const initialState: MembersState = {
    allMembers: {
        members: [],
        loading: false,
        error: null,
    },
    teamMembers: {
        members: [],
        loading: false,
        error: null,
    },
};

export const fetchMembers = createAsyncThunk(
    "members/fetchMembers",
    async () => {
        const response = await axios.get(`${API_URL}user/`, {
            withCredentials: true,
        });
        return response.data;
    }
);

export const fetchTeamMembers = createAsyncThunk(
    "members/fetchTeamMembers",
    async (teamId?: string) => {  // Optional teamId parameter
        const url = `${API_URL}user/my-teams`;
        const response = await axios.get(url, {
            withCredentials: true,
        });
        return response.data;
    }
);

const memberSlice = createSlice({
    name: "members",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Regular members reducers
            .addCase(fetchMembers.pending, (state) => {
                state.allMembers.loading = true;
                state.allMembers.error = null;
            })
            .addCase(fetchMembers.fulfilled, (state, action) => {
                state.allMembers.loading = false;
                state.allMembers.members = action.payload;
            })
            .addCase(fetchMembers.rejected, (state, action) => {
                state.allMembers.loading = false;
                state.allMembers.error = action.error.message || "Failed to fetch members";
            })

            // Team members reducers
            .addCase(fetchTeamMembers.pending, (state) => {
                state.teamMembers.loading = true;
                state.teamMembers.error = null;
            })
            .addCase(fetchTeamMembers.fulfilled, (state, action) => {
                console.log(" team members " + action.payload)
                state.teamMembers.loading = false;
                state.teamMembers.members = action.payload;
            })
            .addCase(fetchTeamMembers.rejected, (state, action) => {
                state.teamMembers.loading = false;
                state.teamMembers.error = action.error.message || "Failed to fetch team members";
            });
    },
});

export default memberSlice.reducer;
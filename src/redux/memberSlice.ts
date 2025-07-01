// src/redux/memberSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = "https://taskmanagerback-0bu3.onrender.com/user/";

export interface Member {
    _id: string;
    email: string;
}

interface MembersState {
    members: Member[];
    loading: boolean;
    error: string | null;
}

const initialState: MembersState = {
    members: [],
    loading: false,
    error: null,
};

export const fetchMembers = createAsyncThunk(
    "members/fetchMembers",
    async () => {
        const response = await axios.get(`${API_URL}`, {
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
            .addCase(fetchMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(fetchMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch members";
            });
    },
});

export default memberSlice.reducer;
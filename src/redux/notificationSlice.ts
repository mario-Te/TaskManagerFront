// src/redux/notificationSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Task } from "../types/task";
const API_URL = "https://taskmanagerback-0bu3.onrender.com/task";


interface NotificationsState {
    notifications: Task[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationsState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

export const fetchNotifications = createAsyncThunk<Task[]>(
    "notifications/fetchNotifications",
    async () => {
        const response = await axios.get(`${API_URL}/unseen`);
        return response.data;
    }
);

export const markNotificationAsRead = createAsyncThunk<string, string>(
    "notifications/markAsRead",
    async (notificationId: string) => {
        await axios.patch(`${API_URL}/${notificationId}`);
        return notificationId;
    }
);

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        socketNotificationReceived: (state, action: PayloadAction<Task>) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(n => !n.read).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch notifications";
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n._id === action.payload);
                if (notification) {
                    notification.read = true;
                    state.unreadCount = state.notifications.filter(n => !n.read).length;
                }
            });
    },
});

export const { socketNotificationReceived } = notificationSlice.actions;
export default notificationSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import memberReducer from "./memberSlice"; // Add this line
import notificationReducer from "./notificationSlice"; // Add this line
import teamReducer from "./teamSlice"; // Add this line
import taskReducer from "./taskSlice"
const store = configureStore({
  reducer: {
    tasks: taskReducer,
    members: memberReducer,
    teams: teamReducer, // Add the team reducer

    notifications: notificationReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

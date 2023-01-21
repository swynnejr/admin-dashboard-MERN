import { createSlice } from "@reduxjs/toolkit";

// Default to Dark Mode
const initialState = {
  mode: "dark",
  // Arbitrary hardcoded user -  No Auth
  userId: "63701cc1f03239b7f700000e",
};

// Use redux to track theme state
export const globalSlice = createSlice({
  name: "global",
  initialState,
  // Use setMode to toggle light/dark
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;

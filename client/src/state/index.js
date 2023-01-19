import { createSlice } from "@reduxjs/toolkit";


// Default to Dark Mode
const initialState = {
  mode: "dark"
};

// Use redux to track theme state
export const globalSlice = createSlice({
  name: "global",
  initialState,
  // Use setMode to toggle light/dark
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? "dark" : 'light';
    }
  }
})

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;
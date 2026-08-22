import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  isSidebarOpen: false,
  globalLoading: false,
  isCalendarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    setCalendarOpen: (state, action) => {
      state.isCalendarOpen = action.payload;
    },
  },
});

export const { toggleTheme, setSidebarOpen, setGlobalLoading, setCalendarOpen } = uiSlice.actions;
export default uiSlice.reducer;

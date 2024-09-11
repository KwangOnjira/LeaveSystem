import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/userSlice'; // Adjust the import path to your userSlice

// Utility function to create a mock store for tests
export const createMockStore = (initialState) => {
  return configureStore({
    reducer: { user: userReducer }, // Add other reducers if needed
    preloadedState: initialState,
  });
};
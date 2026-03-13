import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "../features/fileSlice";

export const store = configureStore({
  reducer: {
    files: fileReducer
  }
});
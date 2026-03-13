// features/fileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { database } from "../firebase/firebaseConfig";
import { ref, push, set, get, update, remove } from "firebase/database";

// ────────────────────────────────────────────────
// Thunks
// ────────────────────────────────────────────────

export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async (file) => {
    const newRef = push(ref(database, "files"));
    const fileData = {
      id: newRef.key,
      name: file.name || "Unnamed file",
      type: file.type || "application/octet-stream",
      size: file.size || 0,
      data: file.data || "",
      uploadDate: new Date().toISOString(),
      category: "Uncategorized",
      starred: false,
      isTrashed: false,
    };

    await set(newRef, fileData);
    return fileData;
  }
);

export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async () => {
    const snapshot = await get(ref(database, "files"));
    if (!snapshot.exists()) return [];

    const rawData = snapshot.val() || {};
    const filesArray = Object.values(rawData);

    // Normalize – ensure EVERY file has required fields
    return filesArray.map((file) => ({
      ...file,
      id: file.id || crypto.randomUUID(),
      name: file.name || "Unnamed file",
      type: file.type || "application/octet-stream",      // ← fixes the main crash cause
      size: file.size || 0,
      data: file.data || "",
      uploadDate: file.uploadDate || new Date().toISOString(),
      category: file.category || "Uncategorized",
      starred: !!file.starred,
      isTrashed: !!file.isTrashed,
    }));
  }
);

export const moveToTrash = createAsyncThunk(
  "files/moveToTrash",
  async (id) => {
    await update(ref(database, `files/${id}`), { isTrashed: true });
    return id;
  }
);

export const restoreFromTrash = createAsyncThunk(
  "files/restoreFromTrash",
  async (id) => {
    await update(ref(database, `files/${id}`), { isTrashed: false });
    return id;
  }
);

export const deletePermanently = createAsyncThunk(
  "files/deletePermanently",
  async (id) => {
    await remove(ref(database, `files/${id}`));
    return id;
  }
);

export const toggleStar = createAsyncThunk(
  "files/toggleStar",
  async ({ id, currentStarred }) => {
    const newValue = !currentStarred;
    await update(ref(database, `files/${id}`), { starred: newValue });
    return { id, starred: newValue };
  }
);

export const updateCategory = createAsyncThunk(
  "files/updateCategory",
  async ({ id, category }) => {
    await update(ref(database, `files/${id}`), { category });
    return { id, category };
  }
);

// ────────────────────────────────────────────────
// Slice
// ────────────────────────────────────────────────

const fileSlice = createSlice({
  name: "files",
  initialState: {
    files: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.files = action.payload;
        state.loading = false;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to load files";
      })

      .addCase(uploadFile.fulfilled, (state, action) => {
        state.files.push(action.payload);
      })

      .addCase(moveToTrash.fulfilled, (state, action) => {
        const file = state.files.find((f) => f.id === action.payload);
        if (file) file.isTrashed = true;
      })

      .addCase(restoreFromTrash.fulfilled, (state, action) => {
        const file = state.files.find((f) => f.id === action.payload);
        if (file) file.isTrashed = false;
      })

      .addCase(deletePermanently.fulfilled, (state, action) => {
        state.files = state.files.filter((f) => f.id !== action.payload);
      })

      .addCase(toggleStar.fulfilled, (state, action) => {
        const file = state.files.find((f) => f.id === action.payload.id);
        if (file) file.starred = action.payload.starred;
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const file = state.files.find((f) => f.id === action.payload.id);
        if (file) file.category = action.payload.category;
      });
  },
});

export default fileSlice.reducer;
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SpeechState {
  transcript: string;
  isRecording: boolean;
}

const initialState: SpeechState = {
  transcript: "",
  isRecording: false,
};

const speechSlice = createSlice({
  name: "speech",
  initialState,
  reducers: {
    setTranscript: (state, action: PayloadAction<string>) => {
      state.transcript = action.payload;
    },
    toggleRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
    },
  },
});

export const { setTranscript, toggleRecording } = speechSlice.actions;

const store = configureStore({
  reducer: {
    speech: speechSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

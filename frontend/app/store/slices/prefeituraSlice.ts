import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PrefeituraState {
  id: string | null;
  cidade: string | null;
}

const initialState: PrefeituraState = {
  id: null,
  cidade: null,
};

const prefeituraSlice = createSlice({
  name: "prefeitura",
  initialState,
  reducers: {
    setPrefeitura(state, action: PayloadAction<PrefeituraState>) {
      state.id = action.payload.id;
      state.cidade = action.payload.cidade;
    },
    clearPrefeitura(state) {
      state.id = null;
      state.cidade = null;
    },
  },
});

export const { setPrefeitura, clearPrefeitura } = prefeituraSlice.actions;
export default prefeituraSlice.reducer;
'use client';
// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const isClient = typeof window !== "undefined";
interface AuthState {
  token: string | null;
  user: {
    id: string;
    nome: string;
    sobrenome: string; // ✅ Adicionado sobrenome
    email: string;
    cpf: string;
    prefeituraId: string;
    cidade: string;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null,
  isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem("token")
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; user: AuthState['user'] }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;


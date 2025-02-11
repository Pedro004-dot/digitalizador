'use client';
// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const isClient = typeof window !== "undefined";
interface AuthState {
  token: string | null;
  user: {
    cidade: string ; 
    telefone: string;
    email: string;
    avatar: string; //foto a ser colocada no perfil
    id: string;
    nome: string;
    cpf: string;
    prefeituraId: string;
  } | null;
  isAuthenticated: boolean;
}

const initialState:AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null,
  isAuthenticated: isClient && !!localStorage.getItem("token")
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
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


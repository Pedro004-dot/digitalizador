'use client';

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import prefeituraReducer from "./slices/prefeituraSlice"
import { authMiddleware } from "./authMiddleware";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      prefeitura: prefeituraReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authMiddleware),
  });

const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
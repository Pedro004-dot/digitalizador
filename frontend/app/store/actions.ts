// app/store/actions.ts
import { createAction } from "@reduxjs/toolkit";

// Crie a ação protegida
export const protectedAction = createAction<{ prefeituraId?: string }>(
  "protected/action"
);
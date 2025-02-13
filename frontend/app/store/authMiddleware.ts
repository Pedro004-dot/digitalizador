import { Middleware } from "@reduxjs/toolkit";
import { logout } from "./slices/authSlice";
import { protectedAction } from "./actions"; // Importe sua action creator

export const authMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  // console.log("Action received:", action);

  if (protectedAction.match(action)) {
    const state = storeAPI.getState();
    const token = state.auth?.token;

    if (!token) {
      console.warn("Usuário não autenticado!");
      storeAPI.dispatch(logout());
      return;
    }

    try {
      // Decodifica o token JWT de forma segura
      const base64Payload = token.split(".")[1];
      if (!base64Payload) {
        throw new Error("Token JWT inválido");
      }

      const payload = JSON.parse(atob(base64Payload)); // Decodifica o payload do JWT
      const userPrefeituraId = payload.prefeituraId;

      // Verifica se a URL possui o prefeituraId correto
      const currentUrl = window.location.pathname;
      const urlPrefeituraId = currentUrl.split("/")[1];

      if (userPrefeituraId !== urlPrefeituraId) {
        console.warn("Usuário tentando acessar uma prefeitura diferente!");
        window.location.href = "/acessoNegado";
        return;
      }
    } catch (error) {
      console.error("Erro ao processar o token:", error);
      storeAPI.dispatch(logout());
      return;
    }
  }

  return next(action);
};
import express from "express";
import { requestPasswordReset, updatePassword } from "../controllers/auth/authController";

const routerAuth = express.Router();

// 🔹 Rota para solicitar código de redefinição
routerAuth.post("/forgot-password", requestPasswordReset);

// 🔹 Rota para redefinir senha
routerAuth.post("/reset-password", updatePassword);

export default routerAuth;
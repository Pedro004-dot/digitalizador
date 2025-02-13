import { Request, Response } from "express";
import { generateResetToken, resetPassword } from "../../services/auth/authService";

/**
 * Inicia o processo de recuperação de senha.
 */
export const requestPasswordReset = async (req: Request, res: Response):Promise<void> => {
  try {
    const { email } = req.body;
    const response = await generateResetToken(email);
     res.json(response);
  } catch (error) {
     res.status(400).json({ message: error });
  }
};

/**
 * Redefine a senha após validar o código OTP.
 */
export const updatePassword = async (req: Request, res: Response):Promise<void> => {
  try {
    const { email, token, novaSenha } = req.body;
    const response = await resetPassword(email, token, novaSenha);
     res.json(response);
  } catch (error) {
     res.status(400).json({ message: error });
  }
};
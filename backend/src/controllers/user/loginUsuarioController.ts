import express, { Request, Response, NextFunction } from 'express';
import { loginUser } from '../../services/user/loginUsuarioService';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, senha } = req.body;

    // Chama o serviço para realizar o login
    const result = await loginUser(email, senha);

    // Retorna o resultado para o cliente
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Erro no login:', error.message);

    // Retorna o erro ao cliente
    res.status(500).json({ message: 'Erro no login. Confira os dados do usuário.' });
  }
};
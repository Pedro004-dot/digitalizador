import { Request, Response } from "express";
import userService from "../../services/user/createUsuarioService";

const createUser = async (req: Request, res: Response) => {
  try {
    const { cpf, nome,email, sobrenome, senha, prefeituraId, permissoes } = req.body;
    const novoUsuario = await userService.createUser({
      cpf,
      nome,
      senha,
      sobrenome,
      email,
      prefeituraId,
      permissoes,
    });
    res.status(201).json(novoUsuario);
   
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

export default { createUser };
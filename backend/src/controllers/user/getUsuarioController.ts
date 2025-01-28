import { Request, Response } from "express";
import userService from "../../services/user/getUsuarioService";

const getUserByCPF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cpf } = req.body;
    const usuario = await userService.getUserByCPF(cpf);

    if (!usuario) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário por CPF:", error);
    res.status(500).json({ error: "Erro ao buscar usuário por CPF" });
  }
};
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const prefeituras = await userService.getAllUsers();
  
      if (prefeituras.length === 0) {
        res.status(404).json({ error: "Nenhum usuario encontrado" });
        return;
      }
  
      res.status(200).json(prefeituras);
    } catch (error) {
      console.error("Erro ao buscar todos os usuarios:", error);
      res.status(500).json({ error: "Erro ao buscar usuarios" });
    }
  };

const getUsersByPrefeitura = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prefeituraId } = req.body;
    const usuarios = await userService.getUsersByPrefeitura(prefeituraId);

    if (usuarios.length === 0) {
      res.status(404).json({ error: "Nenhum usuário encontrado para essa prefeitura" });
      return;
    }

    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários por prefeitura:", error);
    res.status(500).json({ error: "Erro ao buscar usuários por prefeitura" });
  }
};

export default { getUserByCPF, getUsersByPrefeitura, getAllUsers };
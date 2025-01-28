import { Request, Response } from "express";
import userService from "../../services/user/deleteUsusarioService"
const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cpf } = req.body;
  
      const usuario = await userService.deleteUser(cpf);
  
      if (!usuario) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }
  
      res.status(200).json({ message: "Usuário excluído com sucesso", usuario });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({ error: "Erro ao deletar usuário" });
    }
  };
  
  export default {deleteUser };
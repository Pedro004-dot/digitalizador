import prefeituraService from "../../services/prefeituras/deletePrefeituraService";
import { Request, Response } from "express";
const deletePrefeitura = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.body;
  
      const prefeitura = await prefeituraService.deletePrefeitura(id);
  
      if (!prefeitura) {
        res.status(404).json({ error: "Prefeitura não encontrada" });
        return;
      }
  
      res.status(200).json({ message: "Prefeitura excluída com sucesso", prefeitura });
    } catch (error) {
      console.error("Erro ao deletar prefeitura:", error);
      res.status(500).json({ error: "Erro ao deletar prefeitura" });
    }
  };
  
  export default {deletePrefeitura}
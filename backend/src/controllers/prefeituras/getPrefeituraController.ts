import { Request, Response } from "express";
import prefeituraService from "../../services/prefeituras/getPrefeiturasService";

const getPrefeituraById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;

    const prefeitura = await prefeituraService.getPrefeituraById(id);

    if (!prefeitura) {
      res.status(404).json({ error: "Prefeitura não encontrada" });
      return;
    }

    res.status(200).json(prefeitura);
  } catch (error) {
    console.error("Erro ao buscar prefeitura por ID:", error);
    res.status(500).json({ error: "Erro ao buscar prefeitura por ID" });
  }
};
const getAllPrefeituras = async (req: Request, res: Response): Promise<void> => {
    try {
      const prefeituras = await prefeituraService.getAllPrefeituras();
  
      if (prefeituras.length === 0) {
        res.status(404).json({ error: "Nenhuma prefeitura encontrada" });
        return;
      }
  
      res.status(200).json(prefeituras);
    } catch (error) {
      console.error("Erro ao buscar todas as prefeituras:", error);
      res.status(500).json({ error: "Erro ao buscar prefeituras" });
    }
  };
  

const getPrefeituraByCidade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cidade } = req.body;

    if (!cidade) {
      res.status(400).json({ error: "O parâmetro 'cidade' é obrigatório" });
      return;
    }

    const prefeituras = await prefeituraService.getPrefeituraByCidade(cidade as string);

    if (prefeituras.length === 0) {
      res.status(404).json({ error: "Nenhuma prefeitura encontrada para a cidade especificada" });
      return;
    }

    res.status(200).json(prefeituras);
  } catch (error) {
    console.error("Erro ao buscar prefeitura por cidade:", error);
    res.status(500).json({ error: "Erro ao buscar prefeitura por cidade" });
  }
};

export default { getPrefeituraById, getPrefeituraByCidade,getAllPrefeituras };
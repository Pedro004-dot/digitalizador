import { Request, Response } from "express";
import prefeituraService from "../../services/prefeituras/createPrefeiturasService";

const createPrefeitura = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cidade } = req.body;
    if (!cidade) {
      res.status(400).json({ error: "O nome é obrigatório" });
      return;
    }

    const novaPrefeitura = await prefeituraService.createPrefeitura({ cidade });
    res.status(201).json(novaPrefeitura);
  } catch (error) {
    console.error("Erro ao criar prefeitura:", error); // Adiciona log detalhado
    res.status(500).json({ error: "Erro ao criar prefeitura", details: error });
  }
};

export default { createPrefeitura };
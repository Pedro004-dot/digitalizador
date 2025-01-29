import { Request, Response } from "express";
import express from 'express'
import { listFoldersLevel1, listFoldersLevel2, listFiles } from "../aws/s3"

const routerAWS = express.Router();

routerAWS.get("/folders-level1", async (req: Request, res: Response) => {
  try {
    const folders = await listFoldersLevel1();
    res.status(200).json(folders);
  } catch (error) {
    console.error("Erro ao listar pastas de nível 1:", error);
    res.status(500).json({ error: "Erro ao listar pastas de nível 1" });
  }
});

routerAWS.get("/folders-level2/:folder", async (req: Request, res: Response) => {
    const { folder } = req.params;
  
    try {
      const years = await listFoldersLevel2(folder);
      res.status(200).json(years);
    } catch (error) {
      console.error("Erro ao listar pastas de nível 2:", error);
      res.status(500).json({ error: "Erro ao listar pastas de nível 2" });
    }
  });

  routerAWS.get("/files/:folder/:year", async (req: Request, res: Response) => {
    const { folder, year } = req.params;
  
    try {
      const files = await listFiles(folder, year);
      res.status(200).json(files);
    } catch (error) {
      console.error("Erro ao listar arquivos:", error);
      res.status(500).json({ error: "Erro ao listar arquivos" });
    }
  });

  export default routerAWS;
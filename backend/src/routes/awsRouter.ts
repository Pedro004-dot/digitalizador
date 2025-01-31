import { Request, Response } from "express";
import express from 'express'
import { listFoldersLevel1, listFoldersLevel2, listFiles } from "../aws/s3"
import { pesquisaOCR } from "../aws/pesquisaOCR";
import { getRecentFiles } from "../aws/recentFiles";
import generateDownloadUrl from "../aws/downloadArquivo";
import generateSignedUrl from "../aws/downloadArquivo";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Configure as credenciais no .env
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const routerAWS = express.Router();


const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'armazenadordocumentos';

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
      const files = await listFiles(folder, year); // Chamando a função listFiles com os parâmetros da URL
      res.status(200).json(files);
    } catch (error) {
      console.error("Erro ao buscar arquivos:", error);
      res.status(500).json({ error: "Erro ao buscar arquivos." });
    }
  });

  routerAWS.get('/ocr-search', async (req: Request, res: Response):Promise<void> => {
    const { folder, year, searchTerm } = req.query;
  
    try {
      if (!folder || !year || !searchTerm) {
         res.status(400).json({ error: 'Folder, year e searchTerm são obrigatórios.' });
      }
  
      const matchingFiles = await pesquisaOCR(folder as string, year as string, searchTerm as string);
      res.status(200).json(matchingFiles);
    } catch (error) {
      console.error('Erro ao realizar pesquisa OCR:', error);
      res.status(500).json({ error:"Erro ao encontrar arquivos"});
    }
  });

  routerAWS.get('/recent-files', async (_req: Request, res: Response) => {
    try {
      const bucketName = 'armazenadordocumentos'; 
  
      // Chama a função que busca os arquivos recentes
      const recentFiles = await getRecentFiles(bucketName);
  
      res.json(recentFiles);
    } catch (error) {
      console.error('Erro na rota de arquivos recentes:', error);
      res.status(500).json({ error: 'Erro ao buscar arquivos recentes' });
    }
  });

  routerAWS.get('/files/download/:folder/:year/:filename', async (req, res) => {
    const { folder, year, filename } = req.params;
    try {
      const s3Key = `${folder}/${year}/${filename}`;
      const s3Response = await s3.getObject({ Bucket: BUCKET_NAME, Key: s3Key }).promise();
  
      // Se ContentType for undefined, use um valor padrão
      const contentType = s3Response.ContentType || 'application/octet-stream';
  
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', contentType);
      
      if (s3Response.Body) {
        res.send(s3Response.Body);
      } else {
        res.status(404).json({ error: 'Arquivo não encontrado no S3' });
      }
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      res.status(500).json({ error: 'Erro ao baixar arquivo' });
    }
  });

  routerAWS.get('/aws/files/view/:folder/:year/:filename', async (req, res) => {
    const { folder, year, filename } = req.params;
  
    try {
      const s3Key = `${folder}/${year}/${filename}`;
      const url = await generateDownloadUrl(BUCKET_NAME, s3Key); // Usa a mesma função do download
  
      res.json({ url }); // Retorna a URL para o frontend
    } catch (error) {
      console.error('Erro ao gerar link de visualização:', error);
      res.status(500).json({ error: 'Erro ao visualizar o arquivo' });
    }
  });
  export default routerAWS;
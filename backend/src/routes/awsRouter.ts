import { Request, Response } from "express";
import express from 'express'
import { listFoldersLevel1, listFoldersLevel2, listFiles } from "../aws/s3"
import {S3Client, GetObjectAclCommand} from "@aws-sdk/client-s3"
import { getRecentFiles } from "../aws/recentFiles";
import generateDownloadUrl from "../aws/downloadArquivo";
import 'dotenv/config';
import multer from 'multer';
import uploadFileToS3 from "../aws/uploadAWS";
import { searchPDFs } from "../aws/pesquisaOCR";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { generateSignedUrl } from "../aws/viewArquivo";
import { sendEmailWithFileLink } from "../aws/sendEmail";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const routerAWS = express.Router();

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'armazenadordocumentos';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 * 1024 }, // 10GB limite
});


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

  routerAWS.post("/search", async (req: Request, res: Response) => {
    const { query } = req.body;
  
    if (!query) {
      res.status(400).json({ error: "❌ O campo 'query' é obrigatório." });
      return; // Interrompe a execução corretamente
    }
  
    try {
      const results = await searchPDFs(query);
      
      console.log("📂 Enviando arquivos encontrados:", results);
      
      res.status(200).json({ results });
    } catch (error) {
      console.error("❌ Erro ao buscar nos PDFs:", error);
      res.status(500).json({ error: "Erro ao processar a busca nos arquivos PDF." });
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
        const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key });

        // Enviar comando para o S3
        const s3Response = await s3.send(command);

        // Se ContentType for undefined, use um valor padrão
        const contentType = s3Response.ContentType || 'application/octet-stream';

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', contentType);

        // Converte o Body (ReadableStream) para um Buffer e envia como resposta
        if (s3Response.Body) {
            const chunks: Uint8Array[] = [];
            for await (const chunk of s3Response.Body as Readable) {
                chunks.push(chunk);
            }
            res.send(Buffer.concat(chunks));
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
 

  routerAWS.post('/files/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        console.error('Erro: Nenhum arquivo enviado.');
        res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        return;
      }
  
      console.log('Recebendo arquivo:', req.file.originalname, 'Tamanho:', req.file.size);
  
      const folder = req.body.folder || '';
      const year = req.body.year || new Date().getFullYear().toString();
      const filename = req.body.filename || req.file.originalname;
      const s3Key = folder ? `${folder}/${year}/${filename}` : `${year}/${filename}`;
  
      console.log(`Iniciando upload para S3: ${s3Key}`);
  
      const result = await uploadFileToS3(BUCKET_NAME, s3Key, req.file.buffer, req.file.mimetype);
  
      console.log('Upload concluído:', result);
  
      res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      res.status(500).json({ error: error.message || 'Erro ao fazer upload do arquivo.' });
    }
  });

  routerAWS.get('/view/:fileName', async (req: Request, res: Response): Promise<void> => {
    const { fileName } = req.params;

  console.log(`📥 Rota chamada com o arquivo: ${fileName}`); // Log para verificar o nome do arquivo

  try {
    const url = await generateSignedUrl(fileName);
    res.status(200).json({ url });
  } catch (error) {
    console.error(`❌ Erro ao processar solicitação para: ${fileName}`, error);
    res.status(404).json({ error: error });
  }
  });
 


routerAWS.post('/send-email', async (req: Request, res: Response): Promise<void> => {
  const { email, fileName } = req.body;

  try {
    await sendEmailWithFileLink(email, fileName);
    res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao enviar o e-mail:', error);
    res.status(500).json({ error: error || 'Erro ao enviar o e-mail.' });
  }
});


  
  
 export default routerAWS;
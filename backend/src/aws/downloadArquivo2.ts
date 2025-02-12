// src/controllers/downloadController.ts
import { Request, Response } from "express";
import { S3 } from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME as string;

/**
 * Gera um URL assinado para download do arquivo.
 * O URL incluirá o cabeçalho Content-Disposition para forçar o download.
 *
 * @param fileName - A chave do arquivo no S3.
 * @returns URL assinado.
 */
export async function generateDownloadSignedUrl(fileName: string): Promise<string> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Expires: 60, // Tempo de expiração do URL em segundos
    // Aqui, pegamos o nome do arquivo "real" (a parte após a última barra) para ser usado no download.
    ResponseContentDisposition: `attachment; filename="${fileName.split('/').pop()}"`,
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl("getObject", params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

/**
 * Controller que trata a rota de download.
 */
export async function downloadDocument(req: Request, res: Response): Promise<void> {
  const { fileName } = req.params;
  console.log(`📥 Download solicitado para o arquivo: ${fileName}`);
  try {
    const url = await generateDownloadSignedUrl(fileName);
    res.status(200).json({ url });
  } catch (error) {
    console.error(`❌ Erro ao processar o download para: ${fileName}`, error);
    res.status(404).json({ error });
  }
}
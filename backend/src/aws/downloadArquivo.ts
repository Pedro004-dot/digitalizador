import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// Configurações do AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
/**
 * Gera uma URL assinada para visualizar arquivos no S3.
 * @param bucketName Nome do bucket
 * @param key Caminho do arquivo no bucket
 * @returns URL assinada válida por 2 minutos
 */
const generateSignedUrl = async (bucketName: string, key: string): Promise<string> => {
  try {
      const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
      return await getSignedUrl(s3, command, { expiresIn: 120 }); // Expira em 2 minutos
  } catch (error) {
      console.error('Erro ao gerar URL assinada:', error);
      throw new Error('Erro ao gerar link de visualização.');
  }
};


export default generateSignedUrl
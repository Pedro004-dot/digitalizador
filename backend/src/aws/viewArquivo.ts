import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'meu-bucket';

/**
 * Gera uma URL assinada para visualização de um arquivo no S3.
 * @param fileName Nome do arquivo no bucket
 * @returns URL assinada para visualização
 */
export const generateSignedUrl = async (fileName: string): Promise<string> => {
  if (!fileName) {
    throw new Error("O nome do arquivo é obrigatório.");
  }

  console.log(`📝 Gerando URL para o arquivo: ${fileName}`);

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName, // Certifique-se de que este é o caminho correto no S3
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log(`✅ URL gerada: ${url}`);
    return url;
  } catch (error) {
    console.error(`❌ Erro ao gerar a URL assinada para: ${fileName}`, error);
    throw new Error("Erro ao gerar a URL assinada.");
  }
};

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Criar instância do cliente S3 usando AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION || "sa-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Busca os arquivos mais recentes no S3, ordenados pela data de modificação.
 * @param bucketName Nome do bucket S3
 * @param maxKeys Número máximo de arquivos a buscar (padrão: 5)
 * @returns Lista de arquivos recentes com nome, tamanho e data da última modificação
 */
export const getRecentFiles = async (bucketName: string, maxKeys: number = 5) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: maxKeys,
    });

    const data = await s3.send(command);

    if (!data.Contents || data.Contents.length === 0) {
      return [];
    }

    // Ordenar os arquivos pela última modificação (descendente)
    const recentFiles = data.Contents.sort(
      (a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0)
    ).map((file) => ({
      name: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
    }));

    return recentFiles;
  } catch (error) {
    console.error("❌ Erro ao buscar arquivos recentes:", error);
    throw new Error("Erro ao buscar arquivos recentes");
  }
};
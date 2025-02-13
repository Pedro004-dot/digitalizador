import {
  S3Client,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

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
// getRecentFiles.ts
export const getRecentFiles = async (bucketName: string, maxKeys = 5) => {
  try {
    // 1) Listar objetos
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: maxKeys,
    });
    const data = await s3.send(listCommand);

    if (!data.Contents || data.Contents.length === 0) {
      return [];
    }

    // 2) Ordenar pela última modificação (descendente)
    const sorted = data.Contents.sort(
      (a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0)
    );

    // 3) Para cada arquivo, buscar metadata (createdAt) usando HeadObject
    //    e construir o objeto final
    const recentFiles = await Promise.all(
      sorted.map(async (file) => {
        const key = file.Key!;
        let creationDate: string | null = null;

        try {
          const head = await s3.send(
            new HeadObjectCommand({ Bucket: bucketName, Key: key })
          );
          // A chave no `Metadata` costuma vir em minúsculas, dependendo do envio.
          // Se chamou "createdAt" no PutObject, cheque "head.Metadata?.createdat" ou "createdAt".
          creationDate =
            head.Metadata?.createdat || head.Metadata?.createdAt || null;
        } catch (error) {
          // Se der erro ao obter metadata, não interrompe o processo;
          // apenas segue sem a data de criação
          console.error(`Erro ao obter metadata para ${key}:`, error);
        }

        return {
          key,
          name: key, // Se quiser, pode retornar só o `key`
          size: file.Size,
          lastModified: file.LastModified,
          createdAt: creationDate, // Data real do metadata (se houver)
        };
      })
    );

    return recentFiles;
  } catch (error) {
    console.error("❌ Erro ao buscar arquivos recentes:", error);
    throw new Error("Erro ao buscar arquivos recentes");
  }
};
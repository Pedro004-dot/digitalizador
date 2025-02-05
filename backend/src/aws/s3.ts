import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";


// Configurações do AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "";

/**
 * Lista as pastas de nível 1 dentro do bucket S3.
 * @returns Lista de nomes de pastas no primeiro nível
 */
export const listFoldersLevel1 = async (): Promise<string[]> => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Delimiter: "/", // Obtém apenas "pastas" no primeiro nível
    });

    const response = await s3.send(command);

    return (
      response.CommonPrefixes?.map((prefix) => prefix.Prefix?.replace("/", ""))
        .filter((prefix): prefix is string => !!prefix) || []
    );
  } catch (error) {
    console.error("❌ Erro ao listar pastas de nível 1:", error);
    throw new Error("Erro ao listar pastas de nível 1");
  }
};

// Função para listar pastas de nível 2 (anos)
/**
 * Lista as pastas de nível 2 dentro de uma pasta de nível 1 no S3.
 * @param folderLevel1 Nome da pasta de nível 1
 * @returns Lista de subpastas dentro da pasta de nível 1
 */
export const listFoldersLevel2 = async (folderLevel1: string): Promise<string[]> => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Delimiter: "/",
      Prefix: `${folderLevel1}/`, // Obtém apenas os subníveis da pasta selecionada
    });

    const response = await s3.send(command);

    return (
      response.CommonPrefixes?.map((prefix) =>
        prefix.Prefix?.replace(`${folderLevel1}/`, "").replace("/", "")
      ).filter((prefix): prefix is string => !!prefix) || []
    );
  } catch (error) {
    console.error(`❌ Erro ao listar pastas de nível 2 em "${folderLevel1}":`, error);
    throw new Error("Erro ao listar pastas de nível 2");
  }
};

  export const listFiles = async (folderLevel1: string, folderLevel2: string): Promise<any[]> => {
    try {
      const params = {
        Bucket: BUCKET_NAME,
        Prefix: `${folderLevel1}/${folderLevel2}/`, // Obtém arquivos dentro do caminho fornecido
      };
  
      // Comando correto para listar objetos no S3 v3
      const command = new ListObjectsV2Command(params);
      const response = await s3.send(command);
  
      // Filtra apenas arquivos, excluindo a "pasta" virtual (se existir)
      const files = response.Contents?.filter((item) => item.Key !== `${folderLevel1}/${folderLevel2}/`) || [];
  
      return files.map((file) => ({
        Key: file.Key, // Caminho completo do arquivo
        Size: file.Size, // Tamanho do arquivo
        LastModified: file.LastModified, // Última modificação
      }));
    } catch (error) {
      console.error("❌ Erro ao listar arquivos do S3:", error);
      throw new Error("Erro ao listar arquivos");
    }
  };
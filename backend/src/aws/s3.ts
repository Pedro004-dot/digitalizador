import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Configure as credenciais no .env
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "";

export const listFoldersLevel1 = async (): Promise<string[]> => {
    const params = {
      Bucket: BUCKET_NAME,
      Delimiter: "/", // Obtém apenas pastas no primeiro nível
    };
  
    const response = await s3.listObjectsV2(params).promise();
    return (
      response.CommonPrefixes?.map((prefix) => prefix.Prefix?.replace("/", ""))
        .filter((prefix): prefix is string => !!prefix) || [] // Filtra valores undefined
    );
  };

// Função para listar pastas de nível 2 (anos)
export const listFoldersLevel2 = async (folderLevel1: string): Promise<string[]> => {
    const params = {
      Bucket: BUCKET_NAME,
      Delimiter: "/",
      Prefix: `${folderLevel1}/`, // Obtém apenas os subníveis da pasta selecionada
    };
  
    const response = await s3.listObjectsV2(params).promise();
    return (
      response.CommonPrefixes?.map((prefix) =>
        prefix.Prefix?.replace(`${folderLevel1}/`, "").replace("/", "")
      ).filter((prefix): prefix is string => !!prefix) || [] // Filtra valores undefined
    );
  };

  export const listFiles = async (folderLevel1: string, folderLevel2: string): Promise<any[]> => {
    try {
      const params = {
        Bucket: BUCKET_NAME,
        Prefix: `${folderLevel1}/${folderLevel2}/`, // Obtém arquivos dentro do caminho fornecido
      };
  
      const response = await s3.listObjectsV2(params).promise();
  
      // Filtra apenas arquivos, excluindo a "pasta" virtual (se existir)
      const files = response.Contents?.filter(item => item.Key !== `${folderLevel1}/${folderLevel2}/`) || [];
  
      // Mapeia os arquivos e busca informações detalhadas com headObject
      const filesWithCreationDate = await Promise.all(
        files.map(async (file) => {
          if (!file.Key) {
            return null; // Ignora arquivos sem chave
          }
          
          const headParams = {
            Bucket: BUCKET_NAME,
            Key: file.Key, // Key garantido como string
          };
  
          try {
            const metadata = await s3.headObject(headParams).promise();
            return {
              Key: file.Key, // Caminho completo do arquivo
              Size: file.Size, // Tamanho do arquivo
              LastModified: file.LastModified, // Última modificação
              CreationDate: metadata.LastModified || file.LastModified, // Data de criação ou última modificação
            };
          } catch (error) {
            console.error(`Erro ao obter metadados do arquivo ${file.Key}:`, error);
            return {
              Key: file.Key,
              Size: file.Size,
              LastModified: file.LastModified,
              CreationDate: null, // Defina como nulo em caso de erro
            };
          }
        })
      );
  
      // Remove quaisquer valores nulos da lista
      return filesWithCreationDate.filter(file => file !== null);
    } catch (error) {
      console.error("Erro ao listar arquivos do S3:", error);
      throw new Error("Erro ao listar arquivos");
    }
  };
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

// Função para listar arquivos no nível 3
export const listFiles = async (folderLevel1: string, folderLevel2: string): Promise<any[]> => {
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: `${folderLevel1}/${folderLevel2}/`, // Obtém apenas os arquivos do caminho completo
  };

  const response = await s3.listObjectsV2(params).promise();
  return (
    response.Contents?.map((file) => ({
      key: file.Key,
      lastModified: file.LastModified,
      size: file.Size,
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
    })) || []
  );
};
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  region: 'sa-east-1', // Ajuste para a sua região
});

/**
 * Função para buscar os arquivos recentes no S3
 */
export const getRecentFiles = async (bucketName: string, maxKeys: number = 5) => {
  try {
    const params = {
      Bucket: bucketName, // Nome do bucket
      MaxKeys: maxKeys, // Quantos arquivos trazer
    };

    const data = await s3.listObjectsV2(params).promise();

    if (!data.Contents) {
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
    console.error('Erro ao buscar arquivos recentes:', error);
    throw new Error('Erro ao buscar arquivos recentes');
  }
};
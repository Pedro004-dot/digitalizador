import AWS from 'aws-sdk';

// Configurações do AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const generateSignedUrl = async (bucketName: string, key: string) => {
    try {
      const params = {
        Bucket: bucketName,
        Key: key,
        Expires: 120, // Expira em 2 minutos
      };
      return await s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.error('Erro ao gerar URL assinada:', error);
      throw new Error('Erro ao gerar link de visualização.');
    }
  };

export default generateSignedUrl
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";


// Configurações do AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


/**
 * Função para fazer upload de um arquivo para o S3 usando AWS SDK v3
 * @param bucketName Nome do bucket
 * @param key Caminho do arquivo dentro do bucket
 * @param fileBuffer Buffer do arquivo
 * @param contentType Tipo de conteúdo do arquivo (MIME Type)
 * @returns URL do arquivo carregado no S3
 */
const uploadFileToS3 = async (
  bucketName: string,
  key: string,
  fileBuffer: Buffer,
  contentType: string
) => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    // Faz o upload do arquivo
    await s3.send(command);

    console.log(`✅ Arquivo "${key}" enviado com sucesso para o S3!`);

    // Retorna a URL do arquivo no S3
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("❌ Erro ao fazer upload:", error);
    throw new Error("Erro ao fazer upload do arquivo.");
  }
};

export default uploadFileToS3;
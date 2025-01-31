import AWS from 'aws-sdk';
import textract from 'aws-sdk/clients/textract';

const s3 = new AWS.S3({ region: 'sa-east-1' });
const textractClient = new textract({ region: 'sa-east-1' });

const bucketName = process.env.BUCKET_NAME ?? 'default-bucket-name';

/**
 * Realiza uma pesquisa OCR em PDFs no S3.
 * @param folder - O nome da pasta no bucket.
 * @param year - O ano da pasta no bucket.
 * @param searchTerm - O termo de pesquisa.
 */
export const pesquisaOCR = async (folder: string, year: string, searchTerm: string) => {
  if (!folder || !year || !searchTerm) {
    throw new Error('Folder, year e searchTerm são obrigatórios.');
  }

  // Listar arquivos no S3
  const params = {
    Bucket: bucketName,
    Prefix: `${folder}/${year}/`,
  };

  const response = await s3.listObjectsV2(params).promise();
  const pdfFiles = response.Contents?.filter((file) => file.Key?.endsWith('.pdf')) || [];

  if (pdfFiles.length === 0) {
    throw new Error('Nenhum arquivo PDF encontrado na pasta especificada.');
  }

  const matchingFiles = [];

  for (const file of pdfFiles) {
    if (file.Key) {
      // Obter o arquivo do S3
      const fileObject = await s3.getObject({ Bucket: bucketName, Key: file.Key }).promise();

      // Enviar o conteúdo para o Textract
      const textractParams: AWS.Textract.DetectDocumentTextRequest = {
        Document: {
          Bytes: fileObject.Body as Buffer,
        },
      };

      const textractResponse = await textractClient.detectDocumentText(textractParams).promise();

      // Verificar se o termo de pesquisa está no texto extraído
      const text = textractResponse.Blocks?.filter((block) => block.BlockType === 'LINE')
        .map((block) => block.Text)
        .join(' ') || '';

      if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
        matchingFiles.push({
          Key: file.Key,
          Text: text,
        });
      }
    }
  }

  return matchingFiles;
};
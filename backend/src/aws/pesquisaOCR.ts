import pdfParse from "pdf-parse";
import { S3Client, ListObjectsV2Command, GetObjectCommand, paginateListObjectsV2 } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "armazenadordocumentos";

/**
 * 🔍 Pesquisa on-the-fly em todos os PDFs do bucket, percorrendo todas as pastas, e imprime logs detalhados.
 * @param query Palavra-chave a ser pesquisada
 * @returns Lista de arquivos que contêm o termo pesquisado, com um snippet do texto extraído
 */
export async function searchPDFs(query: string): Promise<Array<{ key: string; snippet: string }>> {
  try {
    console.log(`\n🔍 Iniciando busca pelo termo: "${query}" nos arquivos PDF do S3...\n`);

    // 🔹 **PASSO 1: Listar todos os objetos no bucket utilizando paginação**
    const paginator = paginateListObjectsV2({ client: s3 }, { Bucket: BUCKET_NAME });
    const allFiles: any[] = [];

    for await (const page of paginator) {
      if (page.Contents) {
        allFiles.push(...page.Contents);
      }
    }

    console.log(`📂 Total de objetos encontrados no bucket: ${allFiles.length}`);

    // Filtra apenas arquivos PDF (ignorando "pastas virtuais")
    const pdfFiles = allFiles.filter((item) => item.Key && item.Key.toLowerCase().endsWith(".pdf"));
    console.log(`📄 Total de arquivos PDF identificados: ${pdfFiles.length}\n`);

    const results: Array<{ key: string; snippet: string }> = [];

    // 🔹 **PASSO 2: Processar cada PDF**
    for (const file of pdfFiles) {
      if (!file.Key) continue;

      try {
        console.log(`📥 Baixando: ${file.Key}`);

        // Baixar o arquivo do S3
        const getCommand = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: file.Key,
        });
        const { Body } = await s3.send(getCommand);
        if (!Body) {
          console.log(`❌ Falha ao baixar: ${file.Key}`);
          continue;
        }

        // Converter Body (ReadableStream) para Buffer
        const chunks: Uint8Array[] = [];
        for await (const chunk of Body as Readable) {
          chunks.push(chunk);
        }
        const pdfBuffer = Buffer.concat(chunks);

        // Extrair texto do PDF
        const pdfData = await pdfParse(pdfBuffer);
        const pdfText = pdfData.text.toLowerCase();

        // Verificar se o texto contém o termo pesquisado (busca case-insensitive)
        if (pdfText.includes(query.toLowerCase())) {
          console.log(`✅ Encontrado em: ${file.Key}`);
          // Tenta pegar um snippet do texto; se não encontrar o índice, usa os primeiros 200 caracteres
          const idx = pdfText.indexOf(query.toLowerCase());
          const snippet = idx >= 0 
            ? pdfText.substring(idx, idx + 200) + "..."
            : pdfText.substr(0, 200) + "...";
          results.push({
            key: file.Key,
            snippet,
          });
        } else {
          console.log(`❌ Não encontrado em: ${file.Key}`);
        }
      } catch (err) {
        console.error(`⚠️ Erro ao processar o arquivo ${file.Key}:`, err);
      }
    }

    console.log(`\n🔍 Pesquisa concluída! Resultados encontrados: ${results.length}\n`);
    return results;
  } catch (error) {
    console.error("❌ Erro na pesquisa on-the-fly:", error);
    throw new Error("Erro ao processar arquivos PDF.");
  }
}
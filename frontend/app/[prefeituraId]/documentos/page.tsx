'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface DocumentProps {
  folder?: string;
  year?: string;
}

const API_BASE_URL = process.env.PORT;

const DocumentosPage = ({ params }: { params: DocumentProps }) => {
  const { folder, year } = params || {};
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!folder) {
          // Listar pastas de nível 1 /Users/pedrotorrezani/Documents/Programacao/digitalizador/backend/src/aws/s3.ts
          const response = await axios.get(`${API_BASE_URL}/aws/folders-level1`);
          setData(response.data);
        } else if (folder && !year) {
          // Listar anos no nível 2
          const response = await axios.get(`/api/s3/level2?folder=${folder}`);
          setData(response.data);
        } else if (folder && year) {
          // Listar arquivos no nível 3
          const response = await axios.get(
            `/api/s3/files?folder=${folder}&year=${year}`
          );
          setData(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do S3:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folder, year]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!folder) {
    // Renderizar pastas de nível 1
    return (
      <div>
        <h1>Pastas de Documentos</h1>
        <ul>
          {data.map((folder) => (
            <li key={folder.name}>
              <a href={`/documentos/${folder.name}`}>{folder.name}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (folder && !year) {
    // Renderizar anos no nível 2
    return (
      <div>
        <h1>Anos da Pasta: {folder}</h1>
        <ul>
          {data.map((year) => (
            <li key={year}>
              <a href={`/documentos/${folder}/${year}`}>{year}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (folder && year) {
    // Renderizar arquivos no nível 3
    return (
      <div>
        <h1>Arquivos em {folder} / {year}</h1>
        <ul>
          {data.map((file) => (
            <li key={file.key}>
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

export default DocumentosPage;
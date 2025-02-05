'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Header from '@/app/components/header';

interface FileData {
  name: string;
  size: string;
  modified: string;
  creationDate: string;
  url?: string; // Para visualizar no navegador
}

const API_URL = process.env.PORT || 'http://localhost:3010';

const ArquivosPage = () => {
  const { folder } = useParams();
  const searchParams = useSearchParams();
  const year = searchParams.get('year'); // Obtém "2025" da URL

  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!folder || !year) return;

      try {
        const response = await axios.get(`${API_URL}/aws/files/${folder}/${year}`);
        const formattedFiles = response.data.map((file: any) => ({
          name: file.Key.split('/').pop(), // Nome do arquivo
          size: (file.Size / 1024).toFixed(2) + ' KB', // Tamanho em KB
          modified: new Date(file.LastModified).toLocaleDateString('pt-BR'), // Data última modificação
          creationDate: new Date(file.CreationDate).toLocaleDateString('pt-BR'), // Data de criação
        }));
        setFiles(formattedFiles);
      } catch (error) {
        console.error('Erro ao buscar arquivos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [folder, year]);

  const handleDownload = async (fileName: string) => {
    try {
      const response = await axios.get(`${API_URL}/aws/files/download/${folder}/${year}/${fileName}`, {
        responseType: 'blob', // Recebe o arquivo em formato binário
      });

      // Criar um link para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName; // Nome do arquivo para download
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao fazer download do arquivo:', error);
    }
  };

  const handleView = async (fileName: string) => {
    try {
      const response = await axios.get(`${API_URL}/aws/files/view/${folder}/${year}/${fileName}`);
      if (response.data.url) {
        window.open(response.data.url, '_blank'); // Abre em nova aba
      } else {
        alert('Erro ao abrir documento');
      }
    } catch (error) {
      console.error("Erro ao abrir o documento:", error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <ProtectedRoute>
          <div className="flex flex-col h-screen">
            <Header/>
            <h1 className="text-2xl font-bold text-black mb-4">
              Arquivos em "{folder}" no ano de {year}
            </h1>

            <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full table-auto border-collapse">
          {/* Cabeçalho da tabela */}
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase font-medium">
            <tr>
              <th className="py-3 px-6 text-left w-2/5 max-w-[200px]">Nome</th>
              <th className="py-3 px-6 text-left w-1/5">Tamanho</th>
              <th className="py-3 px-6 text-left w-1/5">Última Modificação</th>
              <th className="py-3 px-6 text-left w-1/5">Data de Criação</th>
              <th className="py-3 px-6 text-center w-1/5">Ações</th>
            </tr>
          </thead>

          {/* Corpo da tabela */}
          <tbody>
            {files.length > 0 ? (
              files.map((file, index) => (
                <tr
                  key={index}
                  className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  {/* Nome do arquivo */}
                  <td className="py-3 px-6 truncate max-w-[200px] whitespace-nowrap">
                    {file.name}
                  </td>

                  {/* Tamanho */}
                  <td className="py-3 px-6">{file.size}</td>

                  {/* Última Modificação */}
                  <td className="py-3 px-6">{file.modified}</td>

                  {/* Data de Criação */}
                  <td className="py-3 px-6">{file.creationDate}</td>

                  {/* Ações */}
                  <td className="py-3 px-6 text-center flex items-center justify-center gap-4">
                    {/* Ícone de visualização */}
                    <button
                      onClick={() => handleView(file.name)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <img
                        src="/icons/olhoCinza.svg"
                        alt="Visualizar"
                        className="w-6 h-6"
                      />
                    </button>

                    {/* Ícone de download */}
                    <button
                      onClick={() => handleDownload(file.name)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <img
                        src="/icons/donwloadCinza.svg"
                        alt="Download"
                        className="w-6 h-6"
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-600">
                  Nenhum arquivo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
          </div>
    </ProtectedRoute>

  );
};

export default ArquivosPage;
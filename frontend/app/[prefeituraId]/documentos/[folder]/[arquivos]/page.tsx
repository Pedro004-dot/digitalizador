'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import LoadingEffect from '@/app/components/loading';
import HeaderHome from '@/app/components/headerHome';
import { useRouter } from 'next/navigation';

interface FileData {
  name: string;
  size: string;
  modified: string;
  creationDate: string;
  url?: string; // Para visualizar no navegador
}

const API_URL = process.env.PORT || 'http://localhost:3010';

const ArquivosPage = () => {
    const router = useRouter();
  
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

  if (loading) return <div><LoadingEffect/></div>;

  function handleEmail(name: string): void {
    throw new Error('Function not implemented.');
    //implementar função
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col mt-32 mb-32 p-5 h-screen">
          <HeaderHome/>
          <h1 className="text-2xl text-[#0061FF] mt-20 lg:mt-5">
            Arquivos em "{folder}" no ano de {year}
          </h1>
          <button
        onClick={() => router.back()} // Volta para a página anterior
        className="flex items-center text-blue-500 hover:text-blue-700 space-x-2"
      >
        <img
          src="/icons/back.svg" // Atualize o caminho para o seu ícone
          alt="Voltar"
          className="w-5 h-5 m-5"
        />
      </button>
          <div className="w-full bg-white  rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                {/* Cabeçalho da tabela */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                      Nome
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                      Tamanho
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                      Última Modificação
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                      Data de Criação
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 min-w-[150px]">
                      Ações
                    </th>
                  </tr>
                </thead>

                {/* Corpo da tabela */}
                <tbody>
                  {files.length > 0 ? (
                    files.map((file, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-50 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-white"
                        }`}
                      >
                        {/* Nome do arquivo */}
                        <td className="py-4 px-6 text-sm text-gray-800 border-b border-gray-200 truncate max-w-[200px] whitespace-nowrap">
                          {file.name}
                        </td>

                        {/* Tamanho */}
                        <td className="py-4 px-6 text-sm text-gray-800 border-b border-gray-200">
                          {file.size ?? "Não informada"}
                        </td>

                        {/* Última Modificação */}
                        <td className="py-4 px-6 text-sm text-gray-800 border-b border-gray-200">
                          {file.modified ?? "Não informada"}
                        </td>

                        {/* Data de Criação */}
                        <td className="py-4 px-6 text-sm text-gray-800 border-b border-gray-200">
                          {file.creationDate ?? "Não informada"}
                        </td>

                        {/* Ações */}
                        <td className="py-4 px-6 text-center border-b border-gray-200">
                          <div className="flex items-center justify-center gap-4">
                            {/* Ícone de visualização */}
                            <button
                              onClick={() => handleView(file.name)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                              <img
                                src="/icons/olhoCinza.svg"
                                alt="Visualizar"
                                className="w-6 h-6"
                              />
                            </button>

                            {/* Ícone de email */}
                            <button
                              onClick={() => handleEmail(file.name)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                              <img
                                src="/icons/mail.svg"
                                alt="Enviar por email"
                                className="w-6 h-6"
                              />
                            </button>

                            {/* Ícone de download */}
                            <button
                              onClick={() => handleDownload(file.name)}
                              className="text-green-600 hover:text-green-800 transition-colors duration-200"
                            >
                              <img
                                src="/icons/downloadCinza.svg"
                                alt="Download"
                                className="w-6 h-6"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-600">
                        Nenhum arquivo encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
    </div>
    </ProtectedRoute>

  );
};

export default ArquivosPage;
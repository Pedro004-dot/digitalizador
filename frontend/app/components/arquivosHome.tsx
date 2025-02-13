'use client';

import axios from 'axios';
import { useState } from 'react';
import ModalSendEmail from './modalEmail';

interface FileData {
  key:string;
  name: string;
  size: string;
  modified: string;
  creationDate: string;
  url?: string; 
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";
 

// Função para baixar o arquivo
const handleDownload = async (fileName: string) => {
  
  try {
    const encodedFileName = encodeURIComponent(fileName);
    const response = await axios.get(`${API_URL}/aws/download/${encodedFileName}`, {
      responseType: 'blob', // Para garantir que seja tratado como arquivo
    });

    // Criar um link de download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Erro ao baixar o arquivo:', error);
  }
};

// Função para visualizar o arquivo
const handleView = async (fileName: string) => {
  try {
    const encodedFileName = encodeURIComponent(fileName);
    const response = await axios.get(`${API_URL}/aws/view/${encodedFileName}`);
    const { url } = response.data;

    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('URL não encontrada.');
    }
  } catch (error) {
    console.error('Erro ao visualizar o arquivo:', error);
  }
};

// Função para enviar o arquivo por email (exemplo de estrutura)



const MeusArquivos: React.FC<{ files: FileData[] }> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null); 
  const handleEmail = (fileName: string) => {
  
    // console.log(`Abrindo modal para enviar o arquivo: ${fileName}`);
    setSelectedFile(fileName); 
  };
  return (
    <div className="m-5 w-full">
      {/* Título */}
      <h1 className="text-2xl  text-[#0061FF] mb-4">Arquivos recentes</h1>

      {/* Quadro de arquivos */}
      <div id="whiteForm" className="w-full bg-white rounded-lg shadow-md overflow-hidden">
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
                  Ultima Modificação
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
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
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
                          onClick={() => handleView(file.key)}
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
                          onClick={() => handleEmail(file.key)}
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
                          onClick={() => handleDownload(file.key)}
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
        {selectedFile && (
        <ModalSendEmail
          fileName={selectedFile}
          onClose={() => setSelectedFile(null)} // Fecha o modal
        />
      )}
      </div>
    </div>
  );
};

export default MeusArquivos;

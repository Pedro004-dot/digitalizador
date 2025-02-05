'use client';
import React, { useState } from 'react';
import axios from "axios";
import ModalSendEmail from './modalEmail'; // Importe o componente do modal

interface FileData {
  name: string;
  size: string;
}

const API_URL = process.env.PORT || "http://localhost:3010";

const Arquivos: React.FC<{ files: FileData[] }> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null); // Para controlar o modal

  const handleDownload = (fileName: string) => {
    console.log(`Baixando o arquivo: ${fileName}`);
    // Implemente a lógica para download
  };

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

  const handleEmail = (fileName: string) => {
    console.log(`Abrindo modal para enviar o arquivo: ${fileName}`);
    setSelectedFile(fileName); // Abre o modal e define o arquivo selecionado
  };

  return (
    <div className="w-full">
      {/* Título */}
      <h1 className="text-2xl font-bold text-black mb-4">Arquivos recentes</h1>

      {/* Quadro de arquivos */}
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full table-auto border-collapse">
          {/* Cabeçalho da tabela */}
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase font-medium">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">File Size</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>

          {/* Corpo da tabela */}
          <tbody>
            {files.map((file, index) => (
              <tr
                key={index}
                className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-3 px-6">{file.name}</td>
                <td className="py-3 px-6">{file.size}</td>
                <td className="py-3 px-6">
                  <div className="flex gap-2">
                    {/* Botão de download */}
                    <button
                      onClick={() => handleDownload(file.name)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition"
                    >
                      <img
                        src="/icons/donwloadCinza.svg"
                        alt="Download"
                        className="w-6 h-6"
                      />
                    </button>

                    {/* Botão de visualização */}
                    <button
                      onClick={() => handleView(file.name)}
                      className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition"
                    >
                      <img
                        src="/icons/olhoCinza.svg"
                        alt="Visualizar"
                        className="w-6 h-6"
                      />
                    </button>

                    {/* Botão de envio por e-mail */}
                    <button
                      onClick={() => handleEmail(file.name)}
                      className="bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600 transition"
                    >
                      <img
                        src="/icons/mail.svg"
                        alt="email"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para envio de e-mail */}
      {selectedFile && (
        <ModalSendEmail
          fileName={selectedFile}
          onClose={() => setSelectedFile(null)} // Fecha o modal
        />
      )}
    </div>
  );
};

export default Arquivos;
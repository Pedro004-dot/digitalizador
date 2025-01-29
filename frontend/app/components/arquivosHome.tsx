'use client';
import React from 'react';

interface FileData {
  name: string;
  size: string;
  modified: string;
  sharedUsers?: string[]; // Para possíveis imagens de usuários compartilhados no futuro
}

 const MeusArquivos: React.FC<{ files: FileData[] }> = ({ files }) => {

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
                  <th className="py-3 px-6 text-left">Last Modified</th>
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
                    <td className="py-3 px-6">{file.modified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };
export default MeusArquivos

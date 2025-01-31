'use client';
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const PesquisaOCR = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/aws/ocr-search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite para pesquisar nos PDFs"
          className="border rounded p-2 w-full"
        />
        <button
          onClick={handleSearch}
          disabled={!query.trim()}
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pesquisar
        </button>
      </div>

      {loading && <div>Carregando...</div>}

      {results.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold text-lg mb-2">Resultados:</h3>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                <a href={result} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {result}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PesquisaOCR;
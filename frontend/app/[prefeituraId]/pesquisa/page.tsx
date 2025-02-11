'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Arquivos from "@/app/components/arquivos";
import HeaderHome from "@/app/components/headerHome";

interface SearchResult {
  name: string;
  size: string;
  modified: string;
}

const SearchPage = () => {
  const [structure, setStructure] = useState("Sem Filtro");
  const [category, setCategory] = useState("Sem Filtro");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const API_URL = process.env.PORT || "http://localhost:3010";

  const searchDocuments = async (query: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/aws/search`,
        { query }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      throw error;
    }
  };

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setError(null);
    try {
      const response = await searchDocuments(query);

      const formattedResults = response.results.map((file: any) => ({
        name: file.key,
        size: "Tamanho desconhecido",
        modified: "Data desconhecida",
      }));

      setResults(formattedResults);
    } catch (error) {
      setError("Erro ao buscar documentos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <HeaderHome />
        <div className="container mx-auto p-4 w-full mt-32 mb-32">

          <h1 className=" text-2xl font- text-[#0061FF] mb-10 ml-10 mt-20 sm:mt-0">Pesquisar OCR de Documento</h1>
          <div id="whiteForm" className="max-w-4xl mx-auto shadow-md rounded-lg p-8 flex flex-col items-center">

            {/* Campo de pesquisa */}
            <div className="mb-6 w-full">
              <label className="block text-sm font-medium text-gray-700">Digite sua pesquisa</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Use (aspas) para refinar sua pesquisa"
                // border border-gray-300 rounded-lg p-2 sm:p-3 w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center hover:bg-gray-100 transition

                className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:ring-[#0061FF] focus:border-[#0061FF] sm:text-sm"
              />
            </div>

            {/* Botão de pesquisa */}
            <button
              onClick={handleSearch}
              disabled={loading}
              id="textWhite"
              className="w-1/4 mx-auto bg-[#0061FF] text-white py-2 rounded-md hover:bg-[#0050CC] transition disabled:opacity-50"
            >
              {loading ? "Pesquisando..." : "Pesquisar"}
            </button>

            {/* Mensagem de erro */}
            {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

            {/* Botão de Voltar */}

          </div>

          {/* Resultados */}
          <div className="mt-8">
            {results.length > 0 ? (
              <Arquivos files={results} />
            ) : (
              !loading && !error && (
                <p className="text-gray-500 text-center">Nenhum resultado encontrado.</p>
              )
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SearchPage;

'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Arquivos from "@/app/components/arquivos";


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

  const API_URL = process.env.PORT|| "http://localhost:3010";

const searchDocuments = async (query: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/aws/search`,
      { query }
    );
    return response.data; // Presume que o backend retorna { name, size, modified }
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
    throw error;
  }
};

const handleSearch = async () => {
  if (!query) return;

  setLoading(true);
  setError(null); // Resetar erros
  try {
    const response = await searchDocuments(query);

    console.log("🔍 Arquivos encontrados (brutos):", response);

    // Mapeia os resultados para o formato esperado pelo componente
    const formattedResults = response.results.map((file: any) => ({
      name: file.key, // Mapeando key para name
      size: "Tamanho desconhecido", // Adicione um valor padrão
      modified: "Data desconhecida", // Adicione um valor padrão
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
      <div className="p-8  min-h-screen">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold text-[#0061FF] mb-6">Pesquisar OCR de Documento</h1>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Estruturas *</label>
              <select
                value={structure}
                onChange={(e) => setStructure(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0061FF] focus:border-[#0061FF] sm:text-sm"
              >
                <option>Sem Filtro</option>
                <option>Estrutura 1</option>
                <option>Estrutura 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Categorias *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0061FF] focus:border-[#0061FF] sm:text-sm"
              >
                <option>Sem Filtro</option>
                <option>Categoria 1</option>
                <option>Categoria 2</option>
              </select>
            </div>
          </div>

          {/* Campo de pesquisa */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Digite sua pesquisa</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Você usar (aspas) para refinar sua pesquisa"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0061FF] focus:border-[#0061FF] sm:text-sm"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-[#0061FF] text-white py-2 rounded-md hover:bg-[#0050CC] transition disabled:opacity-50"
          >
            {loading ? "Pesquisando..." : "Pesquisar"}
          </button>

          {/* Mensagem de erro */}
          {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
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
    </ProtectedRoute>
  );
};

export default SearchPage;
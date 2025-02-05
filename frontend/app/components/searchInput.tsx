import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const API_URL = process.env.PORT || "http://localhost:3010";

const SearchInput = ({ placeholder = "Pesquise algo..." }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const searchDocuments = async (query: string) => {
    try {
      const response = await axios.get(`${API_URL}/aws/search`, { params: { query } });
      return response.data; // Presume que o backend retorna { key, snippet }
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      throw error;
    }
  };

  const handleSearch = async (query: string) => {
    if (!query) return;
  
    try {
      setLoading(true);
      const results = await searchDocuments(query);
  
      // Construa a URL manualmente /${user?.prefeituraId}/documentos/${folder}
      const resultsQuery = encodeURIComponent(JSON.stringify(results));
      const searchUrl = `${user?.prefeituraId}/pesquisa?data=${resultsQuery}`;
  
      // Redirecione para a página de documentos
      router.push(searchUrl);
    } catch (error) {
      console.error("Erro ao realizar a pesquisa:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center bg-gray-200 rounded-md p-2 w-full">
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent flex-grow outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch(e.currentTarget.value);
        }}
      />
      {loading && <span className="text-sm text-gray-500 ml-2">Buscando...</span>}
    </div>
  );
};

export default SearchInput;
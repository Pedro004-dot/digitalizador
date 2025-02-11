'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import CardPastas from '../../../components/cardPastas';
import { RootState } from '@/app/store/store';
import { useSelector } from 'react-redux';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import HeaderHome from '@/app/components/headerHome';
import LoadingEffect from '@/app/components/loading';

const API_URL = process.env.PORT || "http://localhost:3010";

const FolderPage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
  const { folder } = useParams();
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!folder) return;

    const fetchYears = async () => {
      try {
        const response = await axios.get(`${API_URL}/aws/folders-level2/${folder}`);
        setYears(response.data);
      } catch (error) {
        console.error('Erro ao buscar anos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, [folder]);

  if(loading) return <div><LoadingEffect/></div>;

  return (
    <ProtectedRoute>
      <div className='flex flex-col h-screen p-4 w-full mt-32 mb-32'>
      <HeaderHome/>
      <div className="container mx-auto">
        <h2 className="text-2xl text-[#0061FF] ml-5 mt-16 lg:mt-5">Pasta {folder}</h2>
        <button
        onClick={() => router.back()} // Volta para a página anterior
        className="flex items-center text-blue-500 hover:text-blue-700 space-x-2">
        <img
          src="/icons/back.svg" // Atualize o caminho para o seu ícone
          alt="Voltar"
          className="w-5 h-5 m-5"
        />
        </button>
        <div id="whiteForm" className="flex flex-wrap m-10 gap-6 p-5 rounded-xs rounded-sm rounded-md rounded-lg shadow-md bg-gray-50">
          {years.map((year, index) => (
            <div
              key={index}

              onClick={() => router.push(`/${user?.prefeituraId}/documentos/${folder}/arquivos?year=${year}`)}
              className="cursor-pointer"
            >
              <CardPastas
                title={year}
                //subtitle="Clique para acessar"
              />
            </div>
          ))}
        </div>
      </div>
      </div>
 
    </ProtectedRoute>

  );
};

export default FolderPage;
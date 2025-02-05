'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import CardPastas from '../../../components/cardPastas';
import { RootState } from '@/app/store/store';
import { useSelector } from 'react-redux';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Header from '@/app/components/header';

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

  if (loading) return <div>Carregando...</div>;

  return (
    <ProtectedRoute>
      <div className='flex flex-col h-screen'>
        <Header/>
             <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Anos na pasta {folder}</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {years.map((year, index) => (
            <div
              key={index}

              onClick={() => router.push(`/${user?.prefeituraId}/documentos/${folder}/arquivos?year=${year}`)}
              className="cursor-pointer"
            >
              <CardPastas
                title={year}
                subtitle="Clique para acessar"
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
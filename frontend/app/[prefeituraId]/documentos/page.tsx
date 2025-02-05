'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import CardPastas from '../../components/cardPastas';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import PesquisaOCR from '@/app/components/pesquisaOCR';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Header from '@/app/components/header';

const API_URL = process.env.PORT || "http://localhost:3010";

const DocumentosRootPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get(`${API_URL}/aws/folders-level1`);
        setFolders(response.data);
      } catch (error) {
        console.error('Erro ao buscar pastas de nível 1:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <ProtectedRoute>
      <div className='flex flex-col h-screen'>
        <Header/>
        <div className="container mx-auto p-4">
          <div className="flex flex-wrap justify-center gap-6">
           \
          {/* <PesquisaOCR /> */}
            {folders.map((folder, index) => (
              
              <div
                key={index}
                onClick={() => router.push(`/${user?.prefeituraId}/documentos/${folder}`)} // Redireciona com o nome da pasta
                className="cursor-pointer"
              >
                
                <CardPastas
                  title={folder}
                  subtitle="Clique para acessar"
                />
              </div>
            ))}
             <h1>Ola</h1> 
          </div>
        </div>
      </div>

    </ProtectedRoute>

  );
};

export default DocumentosRootPage;
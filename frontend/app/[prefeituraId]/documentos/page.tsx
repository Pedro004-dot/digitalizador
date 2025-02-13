'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import CardPastas from '../../components/cardPastas';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import HeaderHome from '@/app/components/headerHome';
import LoadingEffect from '@/app/components/loading';

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

  if (loading) return <LoadingEffect/>;

  return (
    <ProtectedRoute>
      <div className='flex flex-col h-screen'>
        <HeaderHome/>
        
        <div className="container mx-auto p-4 w-full mt-32 mb-32">
        <h1 className="text-2xl font- text-[#0061FF] mb-10 ml-7 mt-20 sm:mt-0">Meus Arquivos</h1>

          <div id="whiteForm" className="flex flex-wrap justify-center  m-10 gap-6 p-5 rounded-lg rounded-sm rounded-md rounded-lg shadow-md ">
          {/* <PesquisaOCR /> */}
            {folders.map((folder, index) => (
              
              <div
                key={index}
                onClick={() => router.push(`/${user?.prefeituraId}/documentos/${folder}`)} // Redireciona com o nome da pasta
                className="cursor-pointer"
              >
                
                <CardPastas
                  title={folder}
                  
                />
              </div>
            ))}
          </div>
        </div>
      </div>

    </ProtectedRoute>

  );
};

export default DocumentosRootPage;
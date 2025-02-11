'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import axios from 'axios';
import ArquivosHome from '@/app/components/arquivosHome';
import CardPastas from '@/app/components/cardPastas';
import LoadingEffect from '@/app/components/loading';

const API_URL = process.env.PORT || "http://localhost:3010";

export default function HomePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const prefeitura = useSelector((state: RootState) => state.prefeitura);
  const [folders, setFolders] = useState<string[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [recentFiles, setRecentFiles] = useState<any[]>([]); // Ajustado para ser um array de objetos com informações dos arquivos
  const router = useRouter();
  const pathname = usePathname();

  // Função para buscar pastas do nível 1
  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${API_URL}/aws/folders-level1`);
      console.log(`${API_URL}/aws/folders-level1`)
      setFolders(response.data);
    } catch (error) {
      console.error('Erro ao buscar pastas de nível 1:', error);
    } finally {
      setLoadingFolders(false);
    }
  };

  // Função para buscar arquivos recentes
  const fetchRecentFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/aws/recent-files`);
      const formattedFiles = response.data
        .filter((file: any) => !file.name.endsWith('/')) // Filtra apenas os arquivos (sem "/")
        .map((file: any) => ({
          name: file.name.split('/').pop() || 'Arquivo Desconhecido',
          size: file.size ? (file.size / 1024).toFixed(2) + ' KB' : 'Tamanho Desconhecido',
          modified: file.lastModified
            ? new Date(file.lastModified).toLocaleDateString('pt-BR')
            : 'Data Desconhecida',
        }));
      setRecentFiles(formattedFiles);
    } catch (error) {
      console.error('Erro ao buscar arquivos recentes:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Validação de autenticação e busca de dados
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchFolders();
    fetchRecentFiles();

    const urlPrefeituraId = pathname.split('/')[1];
    if (urlPrefeituraId && urlPrefeituraId !== prefeitura.id) {
      console.log('Usuário não autorizado.');
      return;
    }
  }, [isAuthenticated, prefeitura.id, pathname, router]);

  if (!isAuthenticated) {
    return null; // Exibe vazio enquanto redireciona
  }

  return (
    <ProtectedRoute>
  <div className="w-full flex justify-center bg-white">
      {/* Header */}

    
    <div className="w-full mt-40 lg:mt-10 mb-2">

      {loadingFolders ? (
           <LoadingEffect/>
      ) : (
        //quadro de pastas tela inicial
        <div className="w-full mt-8 md:mt-12 lg:mt-16 mb-2">
<div className="flex flex-wrap justify-center gap-6 p-5 rounded-xs rounded-sm rounded-md rounded-lg mx-auto">
{folders.length > 0 ? (
              folders.map((folder, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`/${user?.prefeituraId}/documentos/${folder}`)}
                  className="cursor-pointer"
                >
                  <CardPastas title={folder} subtitle="Clique para acessar" />
                </div>
              ))
            ) : (
              <p className="text-center">Nenhuma pasta encontrada.</p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-center my-8 ">
        <div className="w-1/2 border-t border-gray-300"></div>
      </div>

      {/* Arquivos Recentes */}
      <div className="mt-30 max-w-[1400px] mx-auto w-full">
        {loadingFiles ? (
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        ) : (
          <ArquivosHome files={recentFiles} />
        )}
      </div>
    </div>
  </div>
</ProtectedRoute>
  );
}
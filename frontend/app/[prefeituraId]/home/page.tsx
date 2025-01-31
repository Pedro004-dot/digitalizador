'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import HeaderHome from '@/app/components/headerHome';
import axios from 'axios';
import ArquivosHome from '@/app/components/arquivosHome';
import CardPastas from '@/app/components/cardPastas';

const API_URL = process.env.PORT || "http://localhost:3001";

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
  <div className="w-full flex justify-center">
    {/* Contêiner centralizado para alinhamento */}
    <div className="w-full max-w-[1400px]">
      {/* Header */}
      <HeaderHome />

      {loadingFolders ? (
        <p>Carregando pastas...</p>
      ) : (
        <div className="w-full mt-32 mb-32">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto"
          >
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
              <p className="col-span-full text-center">Nenhuma pasta encontrada.</p>
            )}
          </div>
        </div>
      )}

      {/* Arquivos Recentes */}
      <div className="mt-30 max-w-[1400px] mx-auto w-full">
        {loadingFiles ? (
          <p>Carregando arquivos recentes...</p>
        ) : (
          <ArquivosHome files={recentFiles} />
        )}
      </div>
    </div>
  </div>
</ProtectedRoute>
  );
}
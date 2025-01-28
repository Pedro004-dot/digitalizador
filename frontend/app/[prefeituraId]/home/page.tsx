'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import UserProfile from '@/app/components/profile';

export default function HomePage({ params }: { params: { prefeituraId: string, cidade : string } }) {
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
   const prefeitura = useSelector((state: RootState) => state.prefeitura);
  
  const router = useRouter();
  const pathname = usePathname();

  // Validação de autenticação e ID da prefeitura
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("URL PrefeituraId:", params.prefeituraId); // Mostra o ID da URL
      //console.log("Usuário PrefeituraId:", user.prefeituraId); // Mostra o ID do usuário logado
      router.push('/login');
      return;
    }

    const urlPrefeituraId = pathname.split('/')[1]; // Captura o ID da prefeitura na URL
    if (urlPrefeituraId && urlPrefeituraId !== params.prefeituraId) {
     // router.push('/acessoNegado');
     console.log("Usuario negado")
      return;
    }
  }, [isAuthenticated, params.prefeituraId, pathname, router]);

  if (!isAuthenticated) {
    return null; // Enquanto redireciona, exibe vazio
  }

  return (
    <ProtectedRoute>
      <div className="flex h-full">
        <Sidebar />
        <div>

          <h1 className="text-3xl font-bold">Bem-vindo à Prefeitura {prefeitura.cidade}</h1>
          <div>
            <UserProfile params={params}/>
          </div>
          {/* Conteúdo do dashboard */}
        </div>
      </div>
    </ProtectedRoute>
  );
}
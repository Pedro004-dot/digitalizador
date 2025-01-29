'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import HeaderHome from '@/app/components/headerHome';
import PastasHome from '@/app/components/pastasHome';

import ArquivosHome from '@/app/components/arquivosHome';


export default function HomePage() {
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
   const prefeitura = useSelector((state: RootState) => state.prefeitura);
  
  const router = useRouter();
  const pathname = usePathname();
  const files = [
    { name: 'Website Design.png', size: '2.8 MB', modified: 'Dec 13, 2022' },
    { name: 'UX-UI.zip', size: '242 MB', modified: 'Dec 12, 2022' },
    { name: 'Office.mp4', size: '1.8 GB', modified: 'Dec 12, 2022' },
    { name: 'Presentation.pdf', size: '1.2 MB', modified: 'Dec 11, 2022' },
    { name: 'Notes.txt', size: '500 KB', modified: 'Dec 10, 2022' },
  ];

  // Validação de autenticação e ID da prefeitura
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("URL PrefeituraId:", prefeitura.id); // Mostra o ID da URL
      //console.log("Usuário PrefeituraId:", user.prefeituraId); // Mostra o ID do usuário logado
      router.push('/login');
      return;
    }

    const urlPrefeituraId = pathname.split('/')[1]; // Captura o ID da prefeitura na URL
    if (urlPrefeituraId && urlPrefeituraId !== prefeitura.id) {
     // router.push('/acessoNegado');
     console.log("Usuario negado")
      return;
    }
  }, [isAuthenticated, prefeitura.id, pathname, router]);

  if (!isAuthenticated) {
    return null; // Enquanto redireciona, exibe vazio
  }

  return (
    <ProtectedRoute>
      <div className="w-full flex justify-center">
            {/* Contêiner centralizado para alinhamento */}
            <div className="w-full max-w-[1400px]">
              {/* Header */}
              <HeaderHome />

              {/* Pastas Home */}
              <div className="mt-[15.5vh]">
                <PastasHome />
              </div>

              {/* Arquivos Recentes */}
              <div className="mt-12">
                <ArquivosHome files={files}/>
              </div>
            </div>
          </div>
    </ProtectedRoute>
  );
}
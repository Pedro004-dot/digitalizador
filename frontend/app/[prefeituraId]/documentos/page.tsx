'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Documentos({ params }: { params: { prefeituraId: string } }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const prefeitura = useSelector((state: RootState) => state.prefeitura);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="flex h-full">
        <Sidebar />
        <div>
          <h1 className="text-3xl font-bold">Documentos da Prefeitura {prefeitura.cidade}</h1>
        </div>
      </div>
    </ProtectedRoute>
  );
}
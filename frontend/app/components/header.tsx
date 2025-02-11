'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useRouter } from 'next/navigation';

const Header = () => {
  const prefeitura = useSelector((state: RootState) => state.prefeitura);
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  if (!user || !user.prefeituraId) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-start py-6 px-8 space-y-4">
      {/* Título e saudação */}
      <div>
        <h1 className="text-3xl font-bold text-black">
          Prefeitura {prefeitura.cidade}
        </h1>
        <p className="text-lg text-gray-500">
          {user?.nome} 👋
        </p>
      </div>

      {/* Seta para voltar */}
      <button
        onClick={() => router.back()} // Volta para a página anterior
        className="flex items-center text-blue-500 hover:text-blue-700 space-x-2"
      >
        <img
          src="/icons/back.svg" // Atualize o caminho para o seu ícone
          alt="Voltar"
          className="w-5 h-5 m-5"
        />
      </button>
    </div>
  );
};

export default Header;